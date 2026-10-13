import { SITE, MODELS } from "../config.js";
import { useMetrics } from "../lib/useMetrics.js";

const pct = (v) => (v == null ? "–" : `${(v * 100).toFixed(1)}%`);

export default function About() {
  const metrics = useMetrics();

  return (
    <div className="about">
      <section id="test-results" aria-labelledby="test-results-title">
        <h2 className="eyebrow" id="test-results-title">03 · Test-set results</h2>
        <div className="panel">
          {metrics ? (
            <>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Model</th>
                      <th scope="col">Accuracy</th>
                      <th scope="col">Precision</th>
                      <th scope="col">Recall</th>
                      <th scope="col">F1</th>
                      <th scope="col">AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODELS.map(({ id, name }) => {
                      const m = metrics.models?.[id];
                      return (
                        <tr key={id}>
                          <th scope="row">{name}</th>
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
            <p className="muted">Loading results…</p>
          )}
        </div>
      </section>

      <section id="method" aria-labelledby="method-title">
        <h2 className="eyebrow" id="method-title">04 · Method</h2>
        <div className="panel prose">
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
          <p className="privacy">Your photo never leaves this device. Nothing is uploaded or stored.</p>
        </div>
      </section>

      <section id="limitations" aria-labelledby="limitations-title">
        <h2 className="eyebrow" id="limitations-title">05 · Limitations</h2>
        <div className="panel prose">
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
      </section>
    </div>
  );
}
