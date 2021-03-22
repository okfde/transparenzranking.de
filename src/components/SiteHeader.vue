<template>
  <header class="p-4 md:px-8">
    <div class="flex items-center text-blue">
      <div class="md:w-1/4">
        <router-link to="/">
          <img src="../assets/img/logo.svg" alt="Logo" />
        </router-link>
      </div>
      <div class="w-1/2 hidden md:flex justify-center">
        <router-link to="/">
          <h1 class="text-xl font-bold">Transparenzranking Deutschland</h1>
        </router-link>
      </div>
      <div class="flex-1 md:w-1/4 flex justify-end">
        <div class="md:hidden">
          <router-link to="/laender/" title="Zur Länderübersicht...">
            <icon-menu class="w-8 h-8" />
          </router-link>
        </div>
        <select
          class="hidden md:block bg-light text-sm px-4 py-2 uppercase border border-gray-300 rounded"
          v-model="selector"
          @input="e => $router.push(`/laender/${e.target.value}/`)"
        >
          <option value="choose" disabled>Bundesland wählen...</option>
          <option v-for="state in states" :key="state.name" :value="state.slug">
            {{ state.name }}
          </option>
        </select>
      </div>
    </div>
    <input
      type="checkbox"
      id="nav-toggle"
      class="sr-only"
      aria-label="Navigation öffnen/schließen"
    />
    <nav>hallo</nav>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import IconMenu from '/@vite-icons/mdi/menu';
import states from '@data/states';

const selector = ref('choose');
watch(selector, () => {
  // always reset afterwards
  selector.value = 'choose';
});
</script>

<style lang="postcss" scoped>
header {
  box-shadow: 0 0 4px 0 rgba(128, 128, 128, 0.5);

  #nav-toggle + nav {
    display: none;
  }

  #nav-toggle:checked + nav {
    display: block;
  }
}
</style>