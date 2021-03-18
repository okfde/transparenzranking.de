<template>
  <div class="w-full">
    <div class="flex flex-wrap mb-4">
      <button
        class="category-btn"
        :class="{ active: selected === overview[category.title] }"
        :style="{ borderColor: category.color }"
        v-for="(category, i) in categories"
        :key="i"
        @click="selected = overview[category.title]"
      >
        {{ category.title }}
      </button>
    </div>

    <div class="prose prose-sm mb-4">{{ selected.description }}</div>

    <table>
      <transition-group tag="tbody" name="states">
        <tr
          v-for="bar in selected.states"
          :key="bar.state.name"
          class="transition-all duration-700 ease-in-out"
        >
          <td
            class="text-sm text-gray-700 text-right md:whitespace-nowrap pr-4 flex min-h-8 items-center justify-end"
          >
            <span class="hidden md:inline">{{ bar.state.name }}</span>
            <span class="md:hidden">{{
              bar.state.short || bar.state.name
            }}</span>
          </td>
          <td class="w-full">
            <ranking-bar :color="selected.color" :progress="bar.points" />
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RankingBar from './RankingBar.vue';
import overview from '@data/overview';

const keys = Object.keys(overview);
const first = keys[0];
const selected = ref(overview[first]);
console.log(selected.value, overview[first]);

const categories = keys.map(title => ({ ...overview[title], title }));
</script>

<style lang="postcss" scoped>
.category-btn {
  @apply flex-1 px-2 py-1 border-l-2 rounded-sm bg-gray-200 m-1 text-sm transform-all duration-100;

  &.active {
    @apply flex-1 border-l-4 bg-gray-300;
  }
}

.states-move {
  @apply relative;
}
</style>