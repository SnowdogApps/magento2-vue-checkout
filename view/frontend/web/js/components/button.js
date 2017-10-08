define([
    'vue'
], function(Vue) {
    'use strict'
   
    return Vue.component('buttonelement', {
        props: {
            buttonclass: {
                type: String
            },
            buttontype: {
                type: String
            },
            text: {
                type: String
            },
            buttontitle: {
                type: String
            }
        },
        template: 
        `
        <button :type="buttontype" 
                :class="buttonclass"
                :title="buttontitle"
        >
            {{ text }}
        </button>
        `
    });
});
