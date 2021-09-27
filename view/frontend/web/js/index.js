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

import { createApp } from 'vue'
import App from './App.vue'

// createApp(App).mount('#checkout')

// console.log('sssss')


// import { createApp } from 'vue'
// import './styles.css'

// If you are build a SPA with a single <div id="app"></div> entry you would:
// import App from './App.vue'
// createApp(App).mount('#app')


// The example here is to have multiple Vue apps sprinkled throughout your page
// So we would instantiate any known components by their own
// import HelloWorld from './components/HelloWorld.vue'

for (const el of document.getElementsByClassName('vue-app')) {
  createApp({
    template: el.innerHTML,
    components: {
      App
    }
  }).mount(el)

}
