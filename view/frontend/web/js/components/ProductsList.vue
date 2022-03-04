<template>
  <section v-if="step !== 'success'" class="products-list">
    <h2>Product List</h2>
    <ul class="products">
      <ProductsListItem
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </ul>
  </section>
</template>

<script>
import ProductsListItem from './ProductsListItem.vue';

export default {
  components: {
    ProductsListItem,
  },
  computed: {
    products() {
      return this.$store.state.config.totalsData.items;
    },
    step() {
      return this.$store.state.step;
    },
  },
};
</script>

<style lang="scss" scoped>
.products-list {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #c2c2c2;
}
</style>
