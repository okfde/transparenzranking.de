import path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Legacy from '@vitejs/plugin-legacy';
import Yaml from '@rollup/plugin-yaml';
import WindiCSS from 'vite-plugin-windicss';

import Overview from './src/data/overview';
import States from './src/data/states';
import Categories from './src/data/categories';

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
    Legacy({ targets: ['defaults', 'IE 11'] }),

    Yaml(),
    WindiCSS(),

    Overview(),
    States(),
    Categories()
  ],
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    entry: './src/main.js'
  },

  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
});
