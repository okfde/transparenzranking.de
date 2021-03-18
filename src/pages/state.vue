<template>
  <div class="container">
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

    <table>
      <tr
        v-for="bar in bars"
        :key="bar.state.name"
        class="transition-all duration-700 ease-in-out"
      >
        <td
          class="text-sm text-gray-700 text-right md:whitespace-nowrap pr-4 flex min-h-8 items-center justify-end"
        >
          <span class="hidden md:inline">{{ bar.state.name }}</span>
          <span class="md:hidden">{{ bar.state.short || bar.state.name }}</span>
        </td>
        <td class="w-full">
          <ranking-bar :color="bar.color" :progress="bar.points" />
        </td>
      </tr>
    </table>

    <div v-html="state.description" class="prose mt-8" />
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import states from '@data/states';
import lawtypes from '~/data/lawtypes.yml';

const props = defineProps({
  state: {
    type: String,
    required: true
  }
});

const state = computed(() => states.find(s => s.slug === props.state));
const law = computed(() => lawtypes[state.value.type]);
</script>