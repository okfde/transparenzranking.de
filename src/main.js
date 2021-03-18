import 'virtual:windi.css';
import '@fontsource/cabin/latin-400.css';
import '@fontsource/cabin/latin-600.css';
import '@fontsource/cabin/latin-700.css';
import './assets/styles/base.css';
import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import Index from './pages/index.vue';
import State from './pages/state.vue';
import states from '@data/states';

const routes = [
  {
    path: '/',
    component: Index
  },
  ...states.map(s => ({
    path: `/laender/${s.slug}/`,
    component: State,
    props: { state: s.slug }
  }))
];
console.log(routes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, { routes: routes });
