import { IMAGE_SIZE } from "../config.js";

// Turns a class activation map into a heatmap drawn over the face.
// Positive values pushed the model towards its answer; only those are shown.
export function drawHeatmap(target, face, cam, towardsAutistic) {
  const { data, width, height } = cam;
  const signed = Array.from(data, (v) => (towardsAutistic ? v : -v));
  const max = Math.max(...signed, 1e-6);

  const small = document.createElement("canvas");
  small.width = width;
  small.height = height;
  const sctx = small.getContext("2d");
  const pixels = sctx.createImageData(width, height);
  signed.forEach((v, i) => {
    const t = Math.max(v, 0) / max;
    const [r, g, b] = colormap(t);
    pixels.data.set([r, g, b, Math.round(200 * t)], i * 4);
  });
  sctx.putImageData(pixels, 0, 0);

  target.width = IMAGE_SIZE;
  target.height = IMAGE_SIZE;
  const ctx = target.getContext("2d");
  ctx.drawImage(face, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.globalAlpha = 0.75;
  ctx.drawImage(small, 0, 0, IMAGE_SIZE, IMAGE_SIZE); // smooth upscale of the 7 x 7 map
  ctx.globalAlpha = 1;
}

// Dark blue -> cyan -> yellow -> red.
function colormap(t) {
  const stops = [
    [0, [30, 60, 160]],
    [0.35, [40, 190, 220]],
    [0.65, [250, 220, 60]],
    [1, [230, 40, 40]],
  ];
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i];
    const [t0, c0] = stops[i - 1];
    if (t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return c0.map((c, k) => Math.round(c + f * (c1[k] - c)));
    }
  }
  return stops.at(-1)[1];
}
