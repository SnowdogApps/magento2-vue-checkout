<template>
  <section class="products-list" v-if="step !== 'success'">
    <h2>
      Product List
    </h2>
    <div>
      <ProductsListItem
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>

<script>
import ProductsListItem from './ProductsListItem.vue'

export default {
  components: {
    ProductsListItem
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
