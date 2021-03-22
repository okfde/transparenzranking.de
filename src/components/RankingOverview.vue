<template>
  <div class="w-full">
    <div class="flex flex-wrap mb-4">
      <button
        class="category-btn"
        :class="{ active: category.slug === selected }"
        :style="{ borderColor: category.color }"
        v-for="(category, i) in categories"
        :key="i"
        @click="selected = category.slug"
      >
        {{ category.title }}
      </button>
    </div>

    <div class="prose prose-sm mb-4" v-if="selectedCategory.description">
      {{ selectedCategory.description }}
      <router-link :to="`/methodik/#${selectedCategory.slug}`">
        Mehr...
      </router-link>
    </div>

    <table class="ranking-bars allow-break">
      <transition-group tag="tbody" name="states">
        <tr v-for="bar in overview[selected].states" :key="bar.state.name">
          <td>
            <router-link
              :to="`/laender/${bar.state.slug}/`"
              title="Mehr Details..."
            >
              <span>
                <span class="hidden md:inline">{{ bar.state.name }}</span>
                <span class="md:hidden">
                  {{ bar.state.short || bar.state.name }}
                </span>
              </span>
            </router-link>
          </td>
          <td>
            <router-link
              :to="`/laender/${bar.state.slug}/`"
              title="Mehr Details..."
            >
              <ranking-bar
                :color="overview[selected].color"
                :progress="bar.percentage"
              />
            </router-link>
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import RankingBar from './RankingBar.vue';
import overview from '@data/overview';

const categoryTitles = Object.keys(overview);
const first = categoryTitles[0];
const selected = ref(first);

const categories = categoryTitles.map(title => ({ ...overview[title], title }));
const selectedCategory = computed(() =>
  categories.find(c => c.slug === selected.value)
);
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