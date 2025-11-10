import { query } from "$app/server";

export const getId = query(async () => {
  return crypto.randomUUID();
});
