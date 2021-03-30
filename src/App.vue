<template>
  <div>
    <div>
      <site-header />
      <transition name="fade" mode="out-in" @enter="checkHash">
        <router-view class="mt-32 mb-16 flex-1" :key="$route.path" />
      </transition>
    </div>
    <site-footer />
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head';
import socialPreview from './assets/img/social-preview.png';
import favicon from './assets/img/favicon.png';

const title = 'Informationsfreiheit in Deutschland - Das Transparenzranking';
const description =
  'Transparenzranking.de vergleicht alle Transparenzregelungen Deutschlands.';

useHead({
  title,
  description,
  meta: [
    { property: 'og:image', content: socialPreview },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    {
      rel: 'icon',
      href: favicon
    }
  ]
});

function checkHash() {
  const hash = decodeURIComponent(window.location.hash.substr(1));
  if (!hash) return;

  const offset = document.getElementById(hash)?.offsetTop;
  if (!top) return;

  const header = document.querySelector('#header').offsetHeight;

  window.scroll({
    top: offset - header - 24,
    behavior: 'smooth'
  });
}
</script>