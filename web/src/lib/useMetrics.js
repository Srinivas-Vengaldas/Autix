import { useEffect, useState } from "react";

let request;

// Test-set metrics written by the training notebook (web/public/models/metrics.json).
export function useMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let active = true;
    request ??= fetch(`${import.meta.env.BASE_URL}models/metrics.json`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    request.then((m) => active && setMetrics(m));
    return () => {
      active = false;
    };
  }, []);

  return metrics;
}
