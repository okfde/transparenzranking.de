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
      <router-link
        :to="`/methodik/#${selectedCategory.slug}`"
        v-if="selectedCategory.slug !== 'gesamt'"
      >
        Mehr Informationen...
      </router-link>
    </div>

    <table class="ranking-bars allow-break">
      <transition-group tag="tbody" name="states">
        <tr v-for="bar in selectedCategory.states" :key="bar.state.name">
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
                :color="selectedCategory.color"
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
import overview from '@data/overview';
import categories from '@data/categories';

const first = Object.values(categories)[0];
const selected = ref(first.slug);

const selectedCategory = computed(() => ({
  ...overview[selected.value],
  ...categories[selected.value]
}));
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