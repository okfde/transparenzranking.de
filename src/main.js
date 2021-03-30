import 'virtual:windi.css';
import '@fontsource/cabin/latin-400.css';
import '@fontsource/cabin/latin-600.css';
import '@fontsource/cabin/latin-700.css';
import './assets/styles/base.css';
import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import Index from './pages/index.vue';
import State from './pages/state.vue';
import States from './pages/states.vue';
import Methodology from './pages/methodology.vue';
import NotFound from './pages/404.vue';
import states from '@data/states';

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/laender/',
    component: States
  },
  {
    path: '/methodik/',
    component: Methodology
  },
  ...states.map(s => ({
    path: `/laender/${s.slug}/`,
    component: State,
    props: { state: s.slug }
  })),
  { path: '/:pathMatch(.*)*', component: NotFound },
  { path: '/404', component: NotFound } // for gh pages
];

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, {
  routes,
  scrollBehavior(to, from, savedPosition) {
    const behavior = 'smooth';
    const toTop = savedPosition
      ? { ...savedPosition, behavior }
      : { top: 0, behavior };

    if (!to.hash) return toTop;

    const header = document.querySelector('#header').offsetHeight;

    const getScrollPosition = () => ({
      top: document.querySelector(to.hash)?.offsetTop - header - 24,
      behavior
    });

    if (to.path === from.path) return getScrollPosition();

    return new Promise(resolve =>
      setTimeout(() => resolve(getScrollPosition()), 500)
    );
  }
});
