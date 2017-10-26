define([
    'vue',
    'Snowdog_VueCheckout/js/filters/currency',    
    'Snowdog_VueCheckout/js/filters/trimZero'
], function(Vue, trimZero, currency) {
    'use strict'
   
    return Vue.component('summation', {
        props: {
            containerclass: {
                type: String
            },
            itemclass: {
                type: String
            },
            items: {
                type: Array
            },
            discountamout: {
                type: Number
            },
            itemsqty: {
                type: Number
            },
            currencycode: {
                type: String
            }
        },
        template: 
        `
        <div class="summary" :class="containerclass">
            <div class="summary__item">
                <p class="summary__text">
                    Qty of ordered items: 
                    <strong>
                        {{ itemsqty | trimZero }}
                    </strong>
                </p>
            </div>

            <template v-if="discountamout">
                <div class="summary__item">
                    <p class="summary__text">
                        Discount amount: 
                        <strong>
                            {{ discountamout | currency }}
                        </strong>
                    </p>
                </div>
            </template>

            <div class="summary__item" :class="itemclass" v-for="item in items">
                <p class="summary__name">
                    {{ item.title }}

                    <strong>
                        {{ item.value | currency }} {{ currencycode }}
                    </strong>
                </p>
            </div>
        </div>
        `
    });
});
