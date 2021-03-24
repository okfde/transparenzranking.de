<template>
  <div
    class="flex h-5 border-r-4 border-gray-500 my-1 bg-gray-300 relative"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    ref="container"
  >
    <div
      class="bar"
      :style="{ backgroundColor: color, width: `${progress}%` }"
      ref="bar"
    ></div>

    <span class="text" :style="{ right: textRight }" ref="text">
      {{ progress }} %
    </span>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  props: {
    progress: Number,
    color: String
  },
  data() {
    return { textRight: undefined, ro: undefined };
  },
  mounted() {
    this.ro = new ResizeObserver(
      debounce(this.updateText, 100, {
        leading: true
      })
    );
    this.ro.observe(this.$refs.bar);
    window.addEventListener('resize', this.updateText);
  },
  beforeUnmount() {
    this.ro.unobserve(this.$refs.bar);
    window.removeEventListener('resize', this.updateText);
  },
  methods: {
    updateText() {
      const { offsetWidth: containerWidth } = this.$refs.container;
      const { offsetWidth: textWidth } = this.$refs.text;

      const right = Math.max(
        0,
        containerWidth - containerWidth * (this.progress / 100) - textWidth
      );

      this.textRight = `calc(${right}px + 0.5rem)`;
    }
  }
};
</script>

<style lang="postcss" scoped>
.bar {
  @apply bg-info h-full;
}

.text {
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
  @apply absolute right-1 h-full flex items-center ml-2 pl-4;
  @apply text-xs font-sans text-blue whitespace-nowrap;
}

.bar,
.text {
  @apply transform-all duration-500 ease;
}
</style>