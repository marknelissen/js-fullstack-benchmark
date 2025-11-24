<script setup lang="ts">
const { data } = await useFetch("/api/id");
const now = useState("now", () => new Date().toString());
</script>

<template>
  <h1>Hello Nuxt 3!</h1>
  <p>{{ now }} - {{ data }}</p>
</template>
