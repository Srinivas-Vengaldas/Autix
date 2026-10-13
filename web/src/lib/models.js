import * as tf from "@tensorflow/tfjs";
import { IMAGE_SIZE } from "../config.js";

export async function initBackend() {
  // WebGL uses the GPU and is much faster; fall back to the CPU where it is unavailable.
  const ok = await tf.setBackend("webgl").catch(() => false);
  if (!ok) await tf.setBackend("cpu");
  await tf.ready();
  return tf.getBackend();
}

// Loads one exported model. onProgress receives a number from 0 to 1.
export async function loadModel(url, onProgress) {
  const model = await tf.loadGraphModel(url, { onProgress });
  const outputs = model.modelSignature?.outputs ?? {};
  const names = {
    prob: outputs.prob?.name ?? "Identity_1:0",
    cam: outputs.cam?.name ?? "Identity:0",
  };
  // Warm up once so the first real prediction is fast.
  tf.tidy(() => model.execute(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3]), [names.prob, names.cam]));
  return { model, names };
}

// Runs a model on a 224 x 224 canvas. Returns the score for the "Autistic" class,
// the 7 x 7 class activation map, and the time taken.
export async function predict({ model, names }, canvas) {
  const start = performance.now();
  const [probT, camT] = tf.tidy(() => {
    const x = tf.browser.fromPixels(canvas).toFloat().expandDims(0);
    return model.execute(x, [names.prob, names.cam]);
  });
  const [probData, camData] = await Promise.all([probT.data(), camT.data()]);
  const [h, w] = camT.shape.slice(1);
  tf.dispose([probT, camT]);
  return {
    score: probData[0],
    cam: { data: Float32Array.from(camData), height: h, width: w },
    ms: Math.round(performance.now() - start),
  };
}
