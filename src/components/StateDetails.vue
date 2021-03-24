<template>
  <div class="details">
    <template
      v-for="{ category, achievedPoints, details } in performance"
      :key="category.slug"
    >
      <template v-if="category.slug !== 'gesamt'">
        <h2 :id="category.slug">
          {{ category.title }}
        </h2>

        <span class="points-overall">
          {{ achievedPoints }} von {{ category.maxPoints }} Punkten
        </span>

        <template v-for="(detail, i) in details" :key="i">
          <button
            class="criteria-name"
            :class="{ 'font-bold': visible(detail) }"
            @click="toggle(detail)"
          >
            {{ detail.title }}
            <i-mdi-chevron-down
              class="ml-0.5 h-4 transform transition-transform duration-150 ease"
              :class="{ '-rotate-180': visible(detail) }"
            />
          </button>

          <span class="criteria-points">
            {{ detail.points }} von {{ detail.maxPoints }}
            <span class="sr-only">Punkten</span>
          </span>

          <div class="criteria-bar">
            <div
              v-for="(_, i) in Array(detail.maxPoints)"
              :key="i"
              class="bg-gray-400 h-4 w-4 mr-1 first:rounded-l last:rounded-r"
              :style="{
                backgroundColor: i <= detail.points ? category.color : undefined
              }"
            />
          </div>

          <slide-up-down :active="visible(detail)" class="criteria-details">
            <div>
              <p>
                <strong>Fundstelle: </strong>

                <a
                  v-if="detail.citationLink"
                  :href="detail.citationLink"
                  v-text="detail.citation"
                  title="Zum Gesetzestext..."
                  class="link"
                  target="_blank"
                />
                <span v-else v-text="detail.citation" />
              </p>
              <p v-if="detail.comment">
                <strong>Kommentar:</strong>
                {{ detail.comment }}
              </p>

              <p>
                <strong>Kriterienbeschreibung:</strong>
                {{ detail.description }}
              </p>
            </div>
          </slide-up-down>
        </template>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

defineProps({
  performance: Array
});

const visibleDetails = ref([]);

function visible({ id }) {
  return visibleDetails.value.includes(id);
}

function toggle({ id }) {
  const index = visibleDetails.value.indexOf(id);

  if (index === -1) {
    visibleDetails.value.push(id);
  } else {
    visibleDetails.value.splice(index, 1);
  }
}
</script>

<style lang="postcss" scoped>
.details {
  @apply grid gap-x-3 max-w-full;
  grid-template-columns: auto min-content;

  @screen md {
    grid-template-columns: auto min-content min-content;
  }

  h2 {
    @apply text-xl md:text-3xl font-semibold mt-6 mb-1 col-span-full;
  }

  .points-overall {
    @apply text-gray-500 text-md col-span-full mb-4;
  }

  .criteria-name,
  .criteria-points,
  .criteria-bar {
    @apply flex items-center my-2;
  }

  .criteria-name {
    @apply text-left outline-none;
  }

  .criteria-points {
    @apply md:pr-4 whitespace-nowrap text-gray-500 text-md justify-end;
  }

  .criteria-bar {
    @apply -md:hidden;
  }

  .criteria-details {
    @apply text-gray-600 col-span-full;

    p {
      @apply my-2;

      &:last-of-type {
        /* applied here so the slide transition works better */
        @apply pb-8;
      }
    }
  }
}
</style>