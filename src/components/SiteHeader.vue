<template>
  <header class="p-4 md:px-8 fixed top-0 inset-x-0 bg-light z-50">
    <div class="flex items-center text-blue">
      <div class="md:w-1/4">
        <router-link to="/">
          <img src="../assets/img/logo.svg" alt="Logo" />
        </router-link>
      </div>
      <div class="w-1/2 hidden lg:flex justify-center">
        <router-link to="/">
          <h1 class="text-xl font-bold">Transparenzranking Deutschland</h1>
        </router-link>
      </div>
      <div class="flex-1 md:w-1/4 flex justify-end">
        <div class="menu-link">
          <router-link to="/laender/" title="Zur Länderübersicht...">
            <i-mdi-menu class="w-8 h-8" />
          </router-link>
        </div>
        <select
          v-model="selector"
          @input="e => $router.push(`/laender/${e.target.value}/`)"
        >
          <option value="choose" disabled>Bundesland wählen...</option>
          <option v-for="state in states" :key="state.name" :value="state.slug">
            {{ state.name }}
            {{ state.type === false ? '(kein IFG)' : '' }}
          </option>
        </select>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
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

  select {
    @apply hidden md:block nojs:hidden;
    @apply bg-light text-sm px-4 py-2 border border-gray-300 rounded uppercase;
  }

  .menu-link {
    @apply md:hidden;
  }
}
</style>