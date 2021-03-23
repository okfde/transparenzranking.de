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
            <router-link
              :to="`/methodik/#${bar.category.slug}`"
              v-if="i !== 0"
              title="Mehr Informationen..."
            >
              {{ bar.category.title }}

              <i-mdi-information-outline />
            </router-link>
            <span v-else v-text="bar.category.title" />
          </span>
        </td>
        <td class="w-full">
          <ranking-bar :color="bar.category.color" :progress="bar.percentage" />
        </td>
      </tr>
    </table>

    <div class="prose prose-lg my-8">
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

    <state-details v-if="state.criteria" :performance="performance" />
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import RankingBar from '../components/RankingBar.vue';
import StateDetails from '../components/StateDetails.vue';

import lawtypes from '~/data/lawtypes.yml';
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