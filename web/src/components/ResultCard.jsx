import { useEffect, useRef } from "react";
import { THRESHOLD } from "../config.js";
import { drawHeatmap } from "../lib/heatmap.js";

function Scale({ value, loading = false }) {
  return (
    <div className="scale">
      <div className="bar" aria-hidden="true">
        <div className={`bar-fill${loading ? " loading" : ""}`} style={{ width: `${value * 100}%` }} />
        {!loading && <div className="bar-threshold" style={{ left: `${THRESHOLD * 100}%` }} />}
      </div>
      {!loading && (
        <div className="scale-ticks" aria-hidden="true">
          <span>0.0</span>
          <span>threshold {THRESHOLD.toFixed(1)}</span>
          <span>1.0</span>
        </div>
      )}
    </div>
  );
}

export default function ResultCard({ name, status, progress, result, faceCanvas }) {
  const heatRef = useRef(null);

  useEffect(() => {
    if (result && faceCanvas && heatRef.current) {
      drawHeatmap(heatRef.current, faceCanvas, result.cam, result.score >= THRESHOLD);
    }
  }, [result, faceCanvas]);

  const head = (extra) => (
    <div className="card-head">
      <h3>{name}</h3>
      {extra}
    </div>
  );

  if (status === "error") {
    return (
      <article className="panel card">
        {head()}
        <p className="error">This model could not be loaded. See the setup notes in the project README.</p>
      </article>
    );
  }

  if (status !== "ready") {
    return (
      <article className="panel card">
        {head(<span className="mono muted small">{Math.round(progress * 100)}%</span>)}
        <p className="muted small">Downloading model weights…</p>
        <Scale value={progress} loading />
      </article>
    );
  }

  if (!result) {
    return (
      <article className="panel card">
        {head(<span className="pill">ready</span>)}
        <div className="score placeholder">–.––</div>
        <p className="muted small">The score and heatmap appear here after you analyze a photo.</p>
      </article>
    );
  }

  const autistic = result.score >= THRESHOLD;
  return (
    <article className="panel card">
      {head(<span className="mono muted small">{result.ms} ms</span>)}
      <div className="score-row">
        <span className="score" aria-label={`Model score ${result.score.toFixed(2)}`}>
          {result.score.toFixed(2)}
        </span>
        <span className="score-label">
          score → <strong>{autistic ? "Autistic" : "Non-autistic"}</strong>
        </span>
      </div>
      <Scale value={result.score} />
      <figure className="heat">
        <canvas ref={heatRef} />
        <figcaption>
          Warmer areas pushed {name} towards this answer. A score is the model's output, not a probability that a
          person is autistic.
        </figcaption>
      </figure>
    </article>
  );
}
