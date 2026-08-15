<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ postId: number }>();

const author = ref("");
const body = ref("");
const submitting = ref(false);
const error = ref("");

async function submit() {
  if (submitting.value) return;
  error.value = "";
  submitting.value = true;
  try {
    const res = await fetch(`/posts/${props.postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: author.value, body: body.value }),
    });
    if (!res.ok) throw new Error(await res.text());
    author.value = "";
    body.value = "";
    // The server responded with HX-Trigger: comment-added; htmx listens for this
    // on the fragment container and reloads the comment list (see comments.html).
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="author" placeholder="Name" required />
    <input v-model="body" placeholder="Comment" required />
    <button type="submit" :disabled="submitting">Post</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>
