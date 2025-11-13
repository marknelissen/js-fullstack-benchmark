import { getData } from "../lib/data";

export default async function Dynamic() {
  const data = await getData();
  return (
    <main>
      <h1>Hello Next!</h1>
      <p>
        {new Date().toString()} - {data}
      </p>
    </main>
  );
}
