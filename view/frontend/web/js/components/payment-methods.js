define([
    'vue'
   ], function(Vue) {
       'use strict'
   
    return Vue.component('payment-methods', {
        props: {
            options: {
                type: Array
            },
            labelclass: {
                type: String
            },
            name: {
                type: String
            },
            containerclass: {
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
        <div :class="containerclass">
            <template v-for="option in options">
                <div :class="fieldclass">
                        <input type="radio" 
                                :id="option.code" 
                                :name="name" 
                                :value="option.code"
                                :class="inputclass" 
                        />

                        <label :class="labelclass" :for="option.code">
                            {{ option.title }}
                        </label>
                </div>
            </template>
        </div>
        `
    });
});
