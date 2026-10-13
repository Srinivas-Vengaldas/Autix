import { useEffect, useRef } from "react";
import { THRESHOLD } from "../config.js";
import { drawHeatmap } from "../lib/heatmap.js";

export default function ResultCard({ name, status, progress, result, faceCanvas }) {
  const heatRef = useRef(null);

  useEffect(() => {
    if (result && faceCanvas && heatRef.current) {
      drawHeatmap(heatRef.current, faceCanvas, result.cam, result.score >= THRESHOLD);
    }
  }, [result, faceCanvas]);

  if (status === "error") {
    return (
      <article className="panel card">
        <h3>{name}</h3>
        <p className="error">This model could not be loaded. See the setup notes in the project README.</p>
      </article>
    );
  }

  if (status !== "ready") {
    return (
      <article className="panel card">
        <h3>{name}</h3>
        <p className="muted">Downloading model… {Math.round(progress * 100)}%</p>
        <div className="bar">
          <div className="bar-fill loading" style={{ width: `${progress * 100}%` }} />
        </div>
      </article>
    );
  }

  if (!result) {
    return (
      <article className="panel card">
        <h3>{name}</h3>
        <p className="muted">Ready. Results appear here after you analyze a photo.</p>
      </article>
    );
  }

  const autistic = result.score >= THRESHOLD;
  return (
    <article className="panel card">
      <div className="card-head">
        <h3>{name}</h3>
        <span className="timing">{result.ms} ms</span>
      </div>
      <p className="label">
        Classified as <strong className={autistic ? "tag tag-a" : "tag tag-n"}>{autistic ? "Autistic" : "Non-autistic"}</strong>
      </p>
      <div className="bar" aria-label={`Model score ${result.score.toFixed(2)}`}>
        <div className="bar-fill" style={{ width: `${result.score * 100}%` }} />
        <div className="bar-threshold" style={{ left: `${THRESHOLD * 100}%` }} />
      </div>
      <p className="muted small">
        Model score {result.score.toFixed(2)} for the Autistic class (threshold {THRESHOLD.toFixed(2)}). A score is
        the model's output, not a probability that a person is autistic.
      </p>
      <figure className="heat">
        <canvas ref={heatRef} />
        <figcaption>Class activation map: warmer areas pushed {name} towards this answer.</figcaption>
      </figure>
    </article>
  );
}
