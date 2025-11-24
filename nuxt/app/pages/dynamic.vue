<script setup lang="ts">
const { data } = await useFetch("/api/id");
</script>

<template>
  <h1>Hello Nuxt 3!</h1>
  <p>{{ new Date().toString() }} - {{ data }}</p>
</template>
