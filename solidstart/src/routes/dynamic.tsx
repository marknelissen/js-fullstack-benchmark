import { createAsync, query, type RouteDefinition } from "@solidjs/router";

const getId = query(async () => {
  "use server";
  return crypto.randomUUID();
}, "id");

// Optimize for SSR performance
export default function Dynamic() {
  const id = createAsync(() => getId());
  return (
    <main>
      <h1>Hello Solid Start!</h1>
      <p>
        {new Date().toString()} - {id()}
      </p>
    </main>
  );
}

// Add static metadata to reduce SSR work
export const route = {
  preload: () => getId(),
} satisfies RouteDefinition;
