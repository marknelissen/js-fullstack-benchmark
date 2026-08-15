import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// Builds all islands into a single, non-hashed bundle that the Go server
// serves as static files from ../static/islands (no cache-busting needed for this demo).
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "../static/islands",
    emptyOutDir: true,
    rollupOptions: {
      input: "islands/main.ts",
      output: {
        entryFileNames: "main.js",
        chunkFileNames: "[name].js",
        assetFileNames: "style.css",
      },
    },
  },
});
