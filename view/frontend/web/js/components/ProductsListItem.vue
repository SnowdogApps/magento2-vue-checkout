<template>
  <div class="product">
    <p class="products__title">
      Product name:
      <strong>
        {{ product.name }}
      </strong>
    </p>

    <span class="product__price">
      Price:
      <strong>
        {{ product.price | currency }}
      </strong>
    </span>

    <div class="products__handler">
      <p class="products__information">
        Product details:
      </p>

      <template v-for="detail in JSON.parse(product.options)">
        <span
          class="products__detail"
          :key="detail.id"
        >
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
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .product {
    padding: 10px;
    border-bottom: 1px solid #c2c2c2;
    &:last-child {
      border-bottom: none;
    }
  }
</style>
