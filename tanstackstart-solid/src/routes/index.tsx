import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  component: App,
});

export default function App() {
  return (
    <main>
      <h1>Hello Tanstack Start!</h1>
    </main>
  );
}
