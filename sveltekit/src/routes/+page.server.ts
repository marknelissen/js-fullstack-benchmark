import { randomUUID } from "node:crypto";

export const load = async () => {
  return {
    id: randomUUID(),
  };
};
