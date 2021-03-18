import path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Legacy from '@vitejs/plugin-legacy';
import Yaml from '@rollup/plugin-yaml';
import WindiCSS from 'vite-plugin-windicss';
import Icons from 'vite-plugin-icons';

import Overview from './src/data/overview';
import States from './src/data/states';

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    /* Legacy({ }), */

    Yaml(),
    WindiCSS(),
    Icons(),

    Overview(),
    States()
  ],
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    entry: './src/main.js'
  },

  optimizeDeps: {
    include: ['vue', 'vue-router'],
    exclude: ['vue-demi']
  }
});
