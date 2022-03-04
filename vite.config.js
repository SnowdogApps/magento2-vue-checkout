import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

import path from 'path';

export default defineConfig({
  root: 'view/frontend/web/js',
  plugins: [vue(), eslintPlugin()],
  base: process.env.APP_ENV === 'development' ? '/' : '/dist/',
  build: {
    // output dir for production build
    outDir: path.resolve(__dirname, 'view/frontend/web/js/dist'),
    emptyOutDir: true,

    // emit manifest so PHP can find the hashed files
    manifest: true,
    target: 'es2018',
    rollupOptions: {
      input: path.resolve(__dirname, 'view/frontend/web/js/index.js'),
      output: {
        entryFileNames: 'index.js',
      },
    },
  },
  server: {
    // required to load scripts from custom host
    cors: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 3000,
    },
    strictPort: true,
    port: 3000,
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      formkit: path.resolve(__dirname, 'node_modules/@formkit'),
    },
  },
});
