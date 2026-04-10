import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    tailwindcss(),
    nitro(),
    tanstackStart(),
    solidPlugin({ ssr: true }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
