import { getId } from "../../dynamic/id.remote";

export const GET = async () => {
  return new Response(JSON.stringify({ id: await getId() }), {
    headers: { "Content-Type": "application/json" },
  });
};
