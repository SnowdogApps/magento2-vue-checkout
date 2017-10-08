define([
    'vue',
    'Snowdog_VueCheckout/js/filters/trimZero'    
], function(Vue, trimZero) {
    'use strict'

    return Vue.component('products', {
        props: {
            products: {
                type: Array
            },
            containerclass: {
                type: String
            },
            itemclass: {
                type: String
            },
            currency: {
                type: String
            }
        },
        template: 
        `
        <div class="products" :class="containerclass">
            <div class="products__item" :class="itemclass" v-for="product in products">
                <p class="products__title">
                    Product name: 
                    <strong>
                        {{ product.name }}
                    </strong>
                </p>

                <span class="product__price">
                    Price: 
                    <strong>
                        {{ product.price | currency }} {{ currency }}
                    </strong>
                </span>

                <div class="products__handler">
                    <p class="products__information">
                        Product details:
                    </p>

                    <template v-for="detail in JSON.parse(product.options)">
                        <span class="products__detail">
                            {{ detail.label }}:
                            <strong>
                                {{ detail.value }}
                            </strong>
                        </span>
                    </template>

                    <span class="products__detail">
                        Qty: 
                        <strong>
                            {{ product.qty }}
                        </strong>
                    </span>

                    <template v-if="product.discount_percent > 0">
                        <span class="product__detail">
                            Discount: {{ product.discount_percent }}%
                        </span>
                    </template>
                </div>

                <div class="action">
                    <div class="action__handler">
                        <a href="#" class="link action__link">
                            Edit
                        </a>

                        <a href="#" class="link action__link">
                            Delete
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `
    });
});