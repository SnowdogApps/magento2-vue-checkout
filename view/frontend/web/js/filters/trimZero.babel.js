define([
    'vue'
], function(Vue) {
    'use strict'
   
    Vue.filter('trimZero', function(value) {
        return parseInt(value);
    });
});