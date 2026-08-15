import { createSignal } from "solid-js";

export default function LikeButton(props: {
  postId: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = createSignal(props.initialLikes);
  const [loading, setLoading] = createSignal(false);

  async function like() {
    if (loading()) return;
    setLoading(true);
    try {
      const res = await fetch(`/posts/${props.postId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`request failed: ${res.status}`);
      const data = await res.json();
      setLikes(data.likes);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={like} disabled={loading()}>
      ♥ {likes()}
    </button>
  );
}
