<template>
    <section v-if="step !== 'success'">
        <h1>
            Product List
        </h1>

        <BaseProduct 
            containerclass="grid"
            itemclass="grid__columns"
            :products="config.totalsData.items"
            :currency="config.totalsData.base_currency_code"
        />
    </section>
</template>

<script>
import BaseProduct from './BaseProduct.vue'

export default {
    components: {
        BaseProduct
    },
    data() {
        return {
            baseUrl: baseUrl,
            config: this.$store.state.config
        }
    },
    computed: {
        cartId() {
            return this.$store.state.cart;
        },
        step() {
            return this.$store.state.step;
        }
    }
}
</script>
