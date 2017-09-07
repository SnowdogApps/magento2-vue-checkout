define([
 'vue'
], function(Vue) {
    'use strict'

    return Vue.component('inputfield', {
        props: {
            label: {
                type: String
            },
            name: {
                type: String
            },
            fieldclass: {
                type: String
            },
            inputclass: {
                type: String
            }
        },
        template: 
        `
        <div :class="fieldclass">
            <label :for="name">
                {{ label }}
            </label>

            <input type="text" :name="name" :class="inputclass">
        </div>
        `
    });
});
