define([
    'vue'
], function(Vue) {
    'use strict'
   
    return Vue.component('selectfield', {
        props: {
            options: {
                type: Array
            },
            label: {
                type: String
            },
            name: {
                type: String
            },
            fieldclass: {
                type: String
            },
            selectclass: {
                type: String
            }
        },
        template: 
        `
        <div :class="fieldclass">
            <label :for="name">
                {{ label }}
            </label>
            
            <select :name="name" :class="selectclass">
                <option v-for="option in options" :value="option.value">
                    {{ option.text }}
                </option>
            </select>
        </div>
        `
    });
});
