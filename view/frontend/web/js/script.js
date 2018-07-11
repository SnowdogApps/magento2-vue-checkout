import Vue from 'vue'
import store from './store'
import App from './App.vue'
import * as filters from './filters'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

// register global filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#checkout',
  store,
  render: h => h(App)
})
