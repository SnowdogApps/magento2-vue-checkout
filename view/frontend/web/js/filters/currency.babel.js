define([
    'vue'
], function(Vue) {
    'use strict'
   
    Vue.filter('currency', function(value) {
        var number =+ value.replace(/[^\d.]/g, '');
        return parseFloat(number).toFixed(2);
    });
});