<template>
  <section class="products-list" v-if="step !== 'success'">
    <h2>
      Product List
    </h2>

    <BaseProduct
      container-class="grid"
      item-class="grid__columns"
      :products="products"
    />
  </section>
</template>

<script>
import BaseProduct from './BaseProduct.vue'

export default {
  components: {
    BaseProduct
  },
  computed: {
    products () {
      return this.$store.state.config.totalsData.items
    },
    step () {
      return this.$store.state.step
    }
  }
}
</script>

<style lang="scss" scoped>
  .products-list {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #c2c2c2;
  }
</style>
