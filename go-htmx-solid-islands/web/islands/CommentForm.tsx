import { createSignal } from "solid-js";

export default function CommentForm(props: { postId: number }) {
  const [author, setAuthor] = createSignal("");
  const [body, setBody] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (submitting()) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/posts/${props.postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: author(), body: body() }),
      });
      if (!res.ok) throw new Error(await res.text());
      setAuthor("");
      setBody("");
      // The server responded with HX-Trigger: comment-added; htmx listens for this
      // on the fragment container and reloads the comment list (see comments.html).
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <input
        value={author()}
        onInput={(e) => setAuthor(e.currentTarget.value)}
        placeholder="Name"
        required
      />
      <input
        value={body()}
        onInput={(e) => setBody(e.currentTarget.value)}
        placeholder="Comment"
        required
      />
      <button type="submit" disabled={submitting()}>
        Post
      </button>
      {error() && <p style={{ color: "red" }}>{error()}</p>}
    </form>
  );
}
