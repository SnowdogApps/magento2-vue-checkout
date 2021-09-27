// import ViteRestart from 'vite-plugin-restart'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
// import liveReload from 'vite-plugin-live-reload'
// import path from 'path'

export default defineConfig({
  root: 'view/frontend/web/js',
  plugins: [
    vue()
    // liveReload(__dirname + 'view/frontend/templates/onepage.phtml'),
    // ViteRestart({
    //   restart: [
    //     'view/frontend/templates/onepage.phtml'
    //   ]
    // })
  ],
  base: process.env.APP_ENV === 'development'
  ? '/'
  : '/dist/',

  // build: {
  //   // output dir for production build
  //   outDir: path.resolve(__dirname, 'view/frontend/web/js'),
  //   emptyOutDir: true,

  //   // emit manifest so PHP can find the hashed files
  //   manifest: true,

  //   // esbuild target
  //   target: 'es2018',

  //   // our entry
  //   rollupOptions: {
  //     input: path.resolve(__dirname, 'view/frontend/web/js/index.js'),
  //     output: {
  //       entryFileNames: 'index.js'
  //     }
  //   }
  // },
  server: {
    // required to load scripts from custom host
    cors: true,

    // we need a strict port to match on PHP side
    // change freely, but update on PHP to match the same port
    strictPort: true,
    port: 3000
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
});

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// })
