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
            },
            type: {
                type: String
            },
            value: {
                type: String
            }
        },
        template: 
        `
        <div :class="fieldclass">
            <label :for="name">
                {{ label }}
            </label>

            <input :type="type" :name="name" :class="inputclass" :value="value"/>
        </div>
        `
    });
});
