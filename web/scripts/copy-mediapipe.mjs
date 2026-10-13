// Copies MediaPipe's WebAssembly files into public/ so the site serves them itself
// instead of relying on a CDN.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules", "@mediapipe", "tasks-vision", "wasm");
const to = join(root, "public", "mediapipe", "wasm");

if (!existsSync(from)) {
  console.error("MediaPipe is not installed. Run `npm install` first.");
  process.exit(1);
}
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true, filter: (src) => !src.includes("module_internal") });
console.log("Copied MediaPipe wasm files to public/mediapipe/wasm");
