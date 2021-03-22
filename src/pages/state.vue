<template>
  <div class="container" v-if="state">
    <h1 class="headline">{{ state.name }}</h1>
    <div class="prose">
      <div class="text-center italic">
        <p v-if="state.type && state.type !== 'none'">
          {{ law }} seit {{ state.year }}.
          <a
            :href="`https://fragdenstaat.de/zustaendigkeit/${state.fds.slug}/`"
            class="link"
          >
            Anfrage stellen
          </a>
        </p>
        <p v-else>Kein Informationsfreiheitsgesetz</p>
      </div>
    </div>

    <table class="ranking-bars">
      <tr
        v-for="(bar, i) in performance"
        :key="bar.category.slug"
        :class="{ first: i === 0 }"
      >
        <td>
          <span :class="{ 'font-bold': i === 0 }">
            {{ bar.category.title }}

            <router-link :to="`/methodik/#${bar.category.slug}`" v-if="i !== 0">
              <icon-info />
            </router-link>
          </span>
        </td>
        <td class="w-full">
          <ranking-bar :color="bar.category.color" :progress="bar.percentage" />
        </td>
      </tr>
    </table>

    <div class="prose prose-lg mb-8">
      <div v-html="state.description" />

      <p>
        <a
          :href="`https://fragdenstaat.de/blog/tag/${
            state.fds.blog || state.fds.slug
          }`"
        >
          → Aktuelles zu {{ state.name }} im FragDenStaat-Blog
        </a>
      </p>
    </div>

    <template
      v-for="{ category, achievedPoints, details } in performance"
      :key="category.slug"
    >
      <template v-if="category.slug !== 'gesamt'">
        <div class="prose prose-lg details">
          <h2 :id="category.slug">{{ category.title }}</h2>
          <span class="text-gray-500 text-md"
            >{{ achievedPoints }} von {{ category.maxPoints }} Punkten</span
          >
        </div>

        <ul>
          <li v-for="(detail, i) in details" :key="i">
            {{ detail.title }}
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import RankingBar from '../components/RankingBar.vue';
import lawtypes from '~/data/lawtypes.yml';
import IconInfo from '/@vite-icons/mdi/information-outline';
import states from '@data/states';
import _categories from '@data/categories';

const categories = Object.values(_categories);

const props = defineProps({
  state: {
    type: String,
    required: true
  }
});

function getCategory(categorySlug = 'gesamt') {
  return categories.find(c => c.slug === categorySlug);
}

const state = computed(() => states.find(s => s.slug === props.state));
const law = computed(() => lawtypes[state.value.type]);

const performance = computed(() =>
  state.value.performance.map(p => ({
    ...p,
    category: getCategory(p.categorySlug)
  }))
);
</script>

<style lang="postcss" scoped>
.details h2 {
  @apply mb-1;
}
</style>