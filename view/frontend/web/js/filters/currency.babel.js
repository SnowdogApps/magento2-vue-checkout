define([
    'vue'
], function(Vue) {
    'use strict'
   
    Vue.filter('currency', function(value) {
        return parseFloat(value).toFixed(2);
    });
});