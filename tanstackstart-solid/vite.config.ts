import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    // tailwindcss(),
    nitro(),
    tanstackStart(),
    solidPlugin({ ssr: true }),
  ],
});
