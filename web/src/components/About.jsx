import { useEffect, useState } from "react";
import { SITE, MODELS } from "../config.js";

const pct = (v) => (v == null ? "–" : `${(v * 100).toFixed(1)}%`);

export default function About() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch("/models/metrics.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  return (
    <section className="about" id="about">
      <h2>About this project</h2>
      <div className="about-grid">
        <div>
          <h3>How it works</h3>
          <ol>
            <li>MediaPipe finds the face in your photo and frames it the way the training photos were framed.</li>
            <li>
              Two ImageNet models, <strong>Xception</strong> and <strong>VGG19</strong>, were fine-tuned with
              transfer learning on a public dataset of 2,940 face photos. Both run here with TensorFlow.js.
            </li>
            <li>
              Each model has a global-average-pooling head, so its class activation map shows exactly which regions
              drove the score.
            </li>
          </ol>
          <p className="privacy">
            Your photo never leaves this device. Everything runs in your browser; nothing is uploaded or stored.
          </p>
        </div>

        <div>
          <h3>Test-set results</h3>
          {metrics ? (
            <>
              <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Accuracy</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1</th>
                    <th>AUC</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map(({ id, name }) => {
                    const m = metrics.models?.[id];
                    return (
                      <tr key={id}>
                        <td>{name}</td>
                        <td>{pct(m?.accuracy)}</td>
                        <td>{pct(m?.precision)}</td>
                        <td>{pct(m?.recall)}</td>
                        <td>{pct(m?.f1)}</td>
                        <td>{m?.auc?.toFixed(3) ?? "–"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
              <p className="muted small">
                {metrics.test_set ?? "Held-out test set"}, threshold {metrics.threshold ?? 0.5}. Trained{" "}
                {metrics.trained_on ?? ""} with TensorFlow {metrics.tensorflow ?? ""}.
              </p>
            </>
          ) : (
            <p className="muted">Results will appear here once the trained models are added.</p>
          )}
        </div>

        <div>
          <h3>Limitations</h3>
          <ul>
            <li>
              The <a href={SITE.datasetUrl}>dataset</a> was collected from the web. Its labels are not clinically
              verified, and photo quality and source differ between the two classes.
            </li>
            <li>
              Models trained on such data can learn photo style, lighting or age cues instead of anything related to
              autism. The heatmaps help show when that happens.
            </li>
            <li>
              Autism is diagnosed through behavioural assessment by qualified clinicians. No photo-based model can
              diagnose it, and this one should never be used to label a real person.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
