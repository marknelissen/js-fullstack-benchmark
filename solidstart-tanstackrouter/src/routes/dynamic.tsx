import { createFileRoute } from "@tanstack/solid-router";

async function getId() {
  "use server";
  return crypto.randomUUID();
}

export const Route = createFileRoute("/dynamic")({
  loader: () => getId(),
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <main>
      <h1>Hello Tanstack Start!</h1>
      <p>
        {new Date().toString()} - {data()}
      </p>
    </main>
  );
}
