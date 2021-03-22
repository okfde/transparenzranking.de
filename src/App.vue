<template>
  <div>
    <div>
      <site-header />
      <transition name="fade" mode="out-in" @enter="checkHash">
        <router-view class="my-16 flex-1" :key="$route.path" />
      </transition>
    </div>
    <site-footer />
  </div>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';

function checkHash() {
  if (window.location.hash) {
    const hash = decodeURIComponent(window.location.hash.substr(1));
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<style lang="postcss" scoped>
.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.2s;
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}
</style>
