<template>
  <li class="product">
    <p class="products__title">
      {{ $t('productList.name') }}
      <strong>
        {{ product.name }}
      </strong>
    </p>

    <span class="product__price">
      {{ $t('productList.price') }}

      <strong>
        {{ product.price | currency }}
      </strong>
    </span>

    <div class="products__handler">
      <p class="products__information">
        {{ $t('productList.details') }}
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
        {{ $t('productList.qty') }}
        <strong>
          {{ product.qty }}
        </strong>
      </span>

      <template v-if="product.discount_percent > 0">
        <span class="product__detail">
          {{ $t('productList.dicsount') }} {{ product.discount_percent }}%
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
