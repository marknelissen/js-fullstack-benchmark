<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ postId: number; initialLikes: number }>();

const likes = ref(props.initialLikes);
const loading = ref(false);

async function like() {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await fetch(`/posts/${props.postId}/like`, { method: "POST" });
    if (!res.ok) throw new Error(`request failed: ${res.status}`);
    const data = await res.json();
    likes.value = data.likes;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <button @click="like" :disabled="loading">♥ {{ likes }}</button>
</template>
