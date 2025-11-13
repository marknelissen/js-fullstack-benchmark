import type { Route } from "./+types/dynamic";

export async function loader({ params }: Route.LoaderArgs) {
  return crypto.randomUUID();
}

export default function Dynamic({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Welcome React Router!</h1>
      <p>
        {new Date().toString()} - {loaderData}
      </p>
    </main>
  );
}
