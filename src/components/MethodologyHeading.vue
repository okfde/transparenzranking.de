<template>
  <h2 :id="category.slug">
    {{ category.title }}
  </h2>
  <span class="text-gray-500 text-md">{{ category.maxPoints }} Punkte</span>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  category: Object
});
</script>

<style scoped>
h2 {
  @apply mb-1;
}
</style>