<template>
  <div class="px-4 md:px-12">
    <div class="flex flex-wrap justify-center">
      <router-link
        v-for="state in states"
        :key="state.name"
        :value="state.slug"
        :to="`/laender/${state.slug}/`"
        class="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 py-6 md:py-12 flex flex-col items-center text-center"
      >
        <img
          :src="state.wappen"
          :alt="`Wappen ${state.name}`"
          class="h-16 md:h-20 object-contain mb-4 md:mb-6"
        />
        <span class="text-gray-500 text-sm">{{ state.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import _states from '@data/states';

console.log(_states);
const states = ref([]);
Promise.all(
  _states.map(async state => ({
    ...state,
    wappen: (await import(`../assets/img/wappen/${state.slug}.svg`)).default
  }))
).then(res => (states.value = res));
</script>