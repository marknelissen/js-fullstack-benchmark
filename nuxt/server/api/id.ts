export default defineEventHandler(() => {
  return { id: crypto.randomUUID() };
});
