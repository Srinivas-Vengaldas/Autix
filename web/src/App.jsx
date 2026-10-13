import { useEffect, useRef, useState } from "react";
import { MODELS, SITE, THRESHOLD } from "./config.js";
import { initBackend, loadModel, predict } from "./lib/models.js";
import { cropToCanvas, findFace, loadFaceDetector } from "./lib/face.js";
import UploadPanel from "./components/UploadPanel.jsx";
import ResultCard from "./components/ResultCard.jsx";
import About from "./components/About.jsx";

const initialModelState = Object.fromEntries(MODELS.map((m) => [m.id, { status: "loading", progress: 0 }]));

export default function App() {
  const loaded = useRef({});
  const [modelState, setModelState] = useState(initialModelState);
  const [faceReady, setFaceReady] = useState(false);
  const [image, setImage] = useState(null);
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | running | noface | done | error
  const [faceCanvas, setFaceCanvas] = useState(null);
  const [results, setResults] = useState({});

  useEffect(() => {
    let cancelled = false;
    const update = (id, patch) =>
      !cancelled && setModelState((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

    initBackend().then(() =>
      Promise.all(
        MODELS.map(async ({ id, url }) => {
          try {
            loaded.current[id] = await loadModel(url, (p) => update(id, { progress: p }));
            update(id, { status: "ready", progress: 1 });
          } catch (err) {
            console.error(`Could not load ${id}`, err);
            update(id, { status: "error" });
          }
        }),
      ),
    );
    loadFaceDetector()
      .then(() => !cancelled && setFaceReady(true))
      .catch((err) => {
        console.warn("Face detector unavailable; the centre of the photo will be used instead", err);
        !cancelled && setFaceReady("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const readyModels = MODELS.filter((m) => modelState[m.id].status === "ready");
  const busy = phase === "running";
  const canAnalyze = Boolean(image && consent && readyModels.length && faceReady && !busy);

  const chooseImage = (file) => {
    if (image) URL.revokeObjectURL(image.url);
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => setImage({ url, el });
    el.src = url;
    setResults({});
    setFaceCanvas(null);
    setPhase("idle");
  };

  const run = async (useWholeImage = false) => {
    setPhase("running");
    setResults({});
    try {
      let box = null;
      if (!useWholeImage && faceReady === true) {
        box = await findFace(image.el);
        if (!box) {
          setFaceCanvas(null);
          setPhase("noface");
          return;
        }
      }
      const canvas = cropToCanvas(image.el, box);
      setFaceCanvas(canvas);
      const out = {};
      for (const { id } of readyModels) {
        out[id] = await predict(loaded.current[id], canvas);
      }
      setResults(out);
      setPhase("done");
    } catch (err) {
      console.error(err);
      setPhase("error");
    }
  };

  const labels = Object.values(results).map((r) => r.score >= THRESHOLD);
  const agreement =
    labels.length === 2 ? (labels[0] === labels[1] ? "Both models agree." : "The two models disagree on this photo.") : null;

  return (
    <>
      <header className="site-header">
        <div className="wrap header-row">
          <div>
            <div className="brand">{SITE.title}</div>
            <p className="tagline">Compare two transfer-learning models on a face photo, entirely in your browser.</p>
          </div>
          <nav>
            <a href="#about">About</a>
            <a href={SITE.githubUrl}>GitHub</a>
          </nav>
        </div>
      </header>

      <div className="notice" role="note">
        <div className="wrap">
          <strong>Educational demo, not a diagnostic tool.</strong> Autism cannot be identified from a photo. These
          models show what a CNN learns from a public dataset and where that goes wrong.
        </div>
      </div>

      <main className="wrap">
        <div className="layout">
          <UploadPanel
            image={image}
            onImage={chooseImage}
            consent={consent}
            onConsent={setConsent}
            canAnalyze={canAnalyze}
            onAnalyze={() => run(false)}
            busy={busy}
            faceCanvas={faceCanvas}
          />

          <section className="results" aria-live="polite" aria-label="Results">
            <h2>Results</h2>
            {phase === "noface" && (
              <div className="panel message">
                <p>
                  <strong>No face found.</strong> The models were trained on close-up face photos, so results on other
                  images mean little.
                </p>
                <button className="secondary" onClick={() => run(true)}>
                  Analyze the whole image anyway
                </button>
              </div>
            )}
            {phase === "error" && (
              <div className="panel message error">Something went wrong while analyzing this image. Try another photo.</div>
            )}
            {agreement && <p className="agreement">{agreement}</p>}
            <div className="cards">
              {MODELS.map(({ id, name }) => (
                <ResultCard
                  key={id}
                  name={name}
                  status={modelState[id].status}
                  progress={modelState[id].progress}
                  result={results[id]}
                  faceCanvas={faceCanvas}
                />
              ))}
            </div>
          </section>
        </div>

        <About />
      </main>

      <footer className="site-footer">
        <div className="wrap">
          Built by {SITE.author} · <a href={SITE.githubUrl}>Source on GitHub</a> · Models run locally with
          TensorFlow.js
        </div>
      </footer>
    </>
  );
}
