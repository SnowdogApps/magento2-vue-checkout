<template>
  <li class="product">
    <p class="products__title">
      {{ $t('Product name') }}:
      <strong>
        {{ product.name }}
      </strong>
    </p>

    <span class="product__price">
      {{ $t('Price') }}:

      <strong>
        {{ product.price | currency }}
      </strong>
    </span>

    <div class="products__handler">
      <p class="products__information">
        {{ $t('Product details') }}:
      </p>

      <template v-for="detail in JSON.parse(product.options)">
        <span
          :key="detail.id"
          class="products__detail"
        >
          {{ detail.label }}:
          <strong>
            {{ detail.value }}
          </strong>
        </span>
      </template>

      <span class="products__detail">
        {{ $t('Qty') }}:
        <strong>
          {{ product.qty }}
        </strong>
      </span>

      <template v-if="product.discount_percent > 0">
        <span class="product__detail">
          {{ $t('Discount') }}: {{ product.discount_percent }}%
        </span>
      </template>
    </div>
  </li>
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
