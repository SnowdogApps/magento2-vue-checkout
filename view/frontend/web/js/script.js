import Vue from 'vue'
import store from './store'
import { i18n } from './i18n'
import App from './App.vue'
import * as filters from './filters'

import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

// register global filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#checkout',
  store,
  i18n,
  render: h => h(App)
})
