import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { randomUUID } from "node:crypto";

export const getId = createServerFn().handler(async () => {
  return randomUUID();
});

export const Route = createFileRoute("/dynamic")({
  loader: () => getId(),
  component: App,
});

export default function App() {
  const data = Route.useLoaderData();
  return (
    <main>
      <h1>Hello Tanstack Start!</h1>
      <p>
        {new Date().toString()} - {data}
      </p>
    </main>
  );
}
