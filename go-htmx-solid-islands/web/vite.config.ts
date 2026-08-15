import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Builds all islands into a single, non-hashed bundle that the Go server
// serves as static files from ../static/islands (no cache-busting needed for this demo).
export default defineConfig({
  plugins: [solid()],
  build: {
    outDir: "../static/islands",
    emptyOutDir: true,
    rollupOptions: {
      input: "islands/main.tsx",
      output: {
        entryFileNames: "main.js",
        chunkFileNames: "[name].js",
        assetFileNames: "style.css",
      },
    },
  },
});
