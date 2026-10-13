import { MODELS } from "../config.js";
import { useMetrics } from "../lib/useMetrics.js";

// Test accuracy and ROC AUC for each model, best model first.
export default function MetricsStrip() {
  const metrics = useMetrics();
  if (!metrics?.models) return null;

  const items = [...MODELS]
    .filter(({ id }) => metrics.models[id])
    .sort((a, b) => (metrics.models[b.id].accuracy ?? 0) - (metrics.models[a.id].accuracy ?? 0))
    .flatMap(({ id, name }) => {
      const m = metrics.models[id];
      return [
        { label: `${name} test accuracy`, value: m.accuracy != null ? `${(m.accuracy * 100).toFixed(1)}%` : "–" },
        { label: `${name} ROC AUC`, value: m.auc != null ? m.auc.toFixed(3) : "–" },
      ];
    });

  return (
    <dl className="metrics-strip">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
