<template>
  <div
    v-bind="attrs"
    :style="style"
    ref="container"
    @transitionend="onTransitionEnd"
  >
    <slot />
  </div>
</template>

<script>
// modified for vue 3
// https://github.com/danieldiekmeier/vue-slide-up-down

export default {
  name: 'slide-up-down',

  props: {
    active: Boolean,
    duration: {
      type: Number,
      default: 200
    },
    tag: {
      type: String,
      default: 'div'
    },
    useHidden: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    style: {},
    initial: false,
    hidden: false
  }),

  watch: {
    active() {
      this.layout();
    }
  },

  mounted() {
    this.layout();
    this.initial = true;
  },

  created() {
    this.hidden = !this.active;
  },

  computed: {
    el() {
      return this.$refs.container;
    },

    attrs() {
      const attrs = {
        'aria-hidden': !this.active,
        'aria-expanded': this.active
      };

      if (this.useHidden) {
        attrs.hidden = this.hidden;
      }

      return attrs;
    }
  },

  methods: {
    layout() {
      if (this.active) {
        this.hidden = false;
        this.$emit('open-start');
        if (this.initial) {
          this.setHeight('0px', () => this.el.scrollHeight + 'px');
        }
      } else {
        this.$emit('close-start');
        this.setHeight(this.el.scrollHeight + 'px', () => '0px');
      }
    },

    asap(callback) {
      if (!this.initial) {
        callback();
      } else {
        this.$nextTick(callback);
      }
    },

    setHeight(temp, afterRelayout) {
      this.style = { height: temp };

      this.asap(() => {
        // force relayout so the animation will run
        this.__ = this.el.scrollHeight;

        this.style = {
          height: afterRelayout(),
          overflow: 'hidden',
          'transition-property': 'height',
          'transition-duration': this.duration + 'ms'
        };
      });
    },

    onTransitionEnd(event) {
      // Don't do anything if the transition doesn't belong to the container
      if (event.target !== this.el) return;

      if (this.active) {
        this.style = {};
        this.$emit('open-end');
      } else {
        this.style = {
          height: '0',
          overflow: 'hidden'
        };
        this.hidden = true;
        this.$emit('close-end');
      }
    }
  }
};
</script>
