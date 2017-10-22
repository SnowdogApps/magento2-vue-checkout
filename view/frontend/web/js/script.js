import Vue from 'vue'
import index from './index.vue'

var app = new Vue({
    el: '#checkout',
    render: h => h(index)
});
