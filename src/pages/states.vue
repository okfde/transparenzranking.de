<template>
  <div class="px-4 md:px-12 min-h-full">
    <div class="flex flex-wrap justify-center">
      <router-link
        v-for="state in states"
        :key="state.name"
        :to="`/laender/${state.slug}/`"
        :title="state.type === 'none' ? `${state.name} (kein IFG)` : state.name"
        class="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 py-6 lg:py-12 flex flex-col items-center text-center"
      >
        <div class="h-12 md:h-16 lg:h-20 mb-4 md:mb-6">
          <transition name="fade">
            <img
              :src="state.wappen"
              :alt="`Wappen ${state.name}`"
              class="h-full"
              :class="{ 'no-ifg': state.type === 'none' }"
              v-if="state.wappen"
            />
          </transition>
        </div>
        <span class="text-gray-500 text-sm">{{ state.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import _states from '@data/states';

const states = ref(_states);
Promise.all(
  _states.map(async state => ({
    ...state,
    wappen: (await import(`../assets/img/wappen/${state.slug}.svg`)).default
  }))
).then(res => (states.value = res));
</script>

<style lang="postcss" scoped>
.no-ifg {
  filter: grayscale(1);
  opacity: 0.25;
}
</style>