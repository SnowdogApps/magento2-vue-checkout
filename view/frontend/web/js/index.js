// import Vue from 'vue'
// import store from './store'
// import App from './App.vue'
// import * as filters from './filters'

// import Vuelidate from 'vuelidate'
// Vue.use(Vuelidate)

// // register global filters
// Object.keys(filters).forEach((key) => {
//   Vue.filter(key, filters[key])
// })

// new Vue({
//   el: '#checkout',
//   store,
//   render: h => h(App)
// })

// import { createApp } from 'vue'
import * as Vue from "vue"; // in Vue 3
import App from "./App.vue";
import { plugin, defaultConfig } from "@formkit/vue";
import "formkit/themes/genesis/theme.css";
import axios from "axios";
import VueAxios from "vue-axios";

for (const el of document.getElementsByClassName("vue-app")) {
  const app = Vue.createApp({
    template: el.innerHTML,
    components: {
      App,
    },
  });

  app.use(plugin, defaultConfig).use(VueAxios, axios).mount(el);
}
