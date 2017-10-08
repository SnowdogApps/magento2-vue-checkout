define([
    'vue',    
    'Snowdog_VueCheckout/js/filters/currency',
   ], function(Vue, currency) {
       'use strict'
   
    return Vue.component('shipping-methods', {
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
            },
            currencycode: {
                type: String
            }
        },
        template: 
        `
        <div :class="containerclass">
            <template v-for="option in options">
                <div :class="fieldclass" v-if="option.available">
                        <input type="radio" 
                               :id="option.carrier_code" 
                               :name="name" 
                               :value="option.carrier_code"
                               :class="inputclass" 
                               :data-method-code="option.method_code"
                        />

                        <label :class="labelclass" :for="option.carrier_code">
                            <span class="label__text">
                                {{ option.carrier_title }}
                            </span>

                            <span class="label__price">
                                {{ option.price_incl_tax | currency }} {{ currencycode }}
                            </span>
                        </label>
                </div>
            </template>
        </div>
        `
    });
});
