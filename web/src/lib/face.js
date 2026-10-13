import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { IMAGE_SIZE } from "../config.js";

let detectorPromise;

export function loadFaceDetector() {
  detectorPromise ??= FilesetResolver.forVisionTasks("/mediapipe/wasm").then((fileset) =>
    FaceDetector.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: "/mediapipe/blaze_face_short_range.tflite" },
      runningMode: "IMAGE",
      minDetectionConfidence: 0.5,
    }),
  );
  return detectorPromise;
}

// Finds the most confident face. Returns its box in image pixels, or null.
export async function findFace(image) {
  const detector = await loadFaceDetector();
  const { detections } = detector.detect(image);
  const best = detections
    .filter((d) => d.boundingBox)
    .sort((a, b) => (b.categories[0]?.score ?? 0) - (a.categories[0]?.score ?? 0))[0];
  return best ? best.boundingBox : null;
}

// The training photos are head shots: measured over 500 of them, the image is about
// 1.15x the detected face box wide and 1.36x tall, with the face slightly below centre.
// Each photo was stretched to 224 x 224, so the site does the same.
const FRAME = { width: 1.15, height: 1.36, shiftUp: 0.15 };
// Photos framed at least this tightly are used whole, exactly as in training.
const TIGHT = { width: 1.6, height: 1.9 };

export function cropToCanvas(image, box) {
  const iw = image.naturalWidth ?? image.width;
  const ih = image.naturalHeight ?? image.height;
  let sx = 0, sy = 0, sw = iw, sh = ih;
  if (box && (iw / box.width > TIGHT.width || ih / box.height > TIGHT.height)) {
    sw = Math.min(box.width * FRAME.width, iw);
    sh = Math.min(box.height * FRAME.height, ih);
    const cx = box.originX + box.width / 2;
    const cy = box.originY + box.height / 2 - FRAME.shiftUp * box.height;
    sx = Math.min(Math.max(cx - sw / 2, 0), iw - sw);
    sy = Math.min(Math.max(cy - sh / 2, 0), ih - sh);
  }

  const canvas = document.createElement("canvas");
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
  return canvas;
}
