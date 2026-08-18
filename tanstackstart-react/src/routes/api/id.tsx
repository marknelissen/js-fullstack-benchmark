import { createFileRoute } from "@tanstack/react-router";
import { getId } from "../dynamic";

export const Route = createFileRoute("/api/id")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(JSON.stringify({ id: await getId() }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
