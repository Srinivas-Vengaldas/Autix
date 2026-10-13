import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves the site from /<repo>/, so the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2500, // TensorFlow.js is large; it loads once and is cached
  },
});
