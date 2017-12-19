<template>
  <section v-if="step !== 'success'">
    <h2>
      Product List
    </h2>

    <BaseProduct
      container-class="grid"
      item-class="grid__columns"
      :products="config.totalsData.items"
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
      return this.$store.getters.cartId;
    },
    step() {
      return this.$store.state.step;
    }
  }
}
</script>
