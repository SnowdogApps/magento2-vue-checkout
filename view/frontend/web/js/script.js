import Vue from './lib/vue.js'
import index from './components/index.vue'

var app = new Vue({
    el: '#checkout',
    render: h => h(index)
});
