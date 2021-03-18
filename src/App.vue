<template>
  <div>
    <site-header />
    <transition name="fade" mode="out-in">
      <router-view class="my-16" :key="$route.path" />
    </transition>
    <site-footer />
  </div>
</template>

<script>
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';

export default {
  components: { SiteHeader, SiteFooter }
};
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
