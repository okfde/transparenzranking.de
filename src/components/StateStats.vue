<template>
  <div>
    <h2>Statistiken von FragDenStaat</h2>

    <div class="grid md:grid-cols-2 gap-3 mt-3">
      <div class="card">
        <h3>Anzahl Anfragen</h3>
        <span class="number" v-text="state.stats.all" />
      </div>
      <div class="card">
        <h3>Anteil erfolgreicher Anfragen</h3>

        <span class="number"> {{ state.stats.successRate }} % </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  state: Object
});
</script>

<style lang="postcss" scoped>
.card {
  @apply flex border border-gray-300 rounded p-4 shadow-sm items-center;

  h3 {
    @apply text-lg flex-1;
  }

  .number {
    @apply pl-2 text-2xl font-serif;
  }
}
</style>