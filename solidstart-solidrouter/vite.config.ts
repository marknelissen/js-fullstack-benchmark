import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin } from "@solidjs/vite-plugin-nitro-2";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    preview: {
      port: 3000,
    },
    plugins: [solidStart(), nitroV2Plugin()],
  };
});
