import Vue from 'vue'
import store from './store'
import index from './index.vue'

var app = new Vue({
  el: '#checkout',
  store,
  render: h => h(index)
});
