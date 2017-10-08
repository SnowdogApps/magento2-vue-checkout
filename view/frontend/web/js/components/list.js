define([
    'vue'
], function(Vue) {
    'use strict'
   
    return Vue.component('listelement', {
        props: {
            ulclass: {
                type: String
            },
            liclass: {
                type: String
            },
            items: {
                type: Array
            },
        },
        template: 
        `
        <ul :class="ulclass">
            <li :class="liclass" v-for="item in items">
                Name: {{ item.name }}
                Qty: {{ item.qty }}
                Price: {{ item.price }}
                Total: {{ item.qty * item.price }}
            </li>
        </ul>
        `
    });
});
