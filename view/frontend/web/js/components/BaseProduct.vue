<template>
  <div
    class="products"
    :class="containerClass"
  >
    <div
      class="products__item"
      :class="itemClass"
      v-for="product in products"
      :key="product.id"
    >
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

      <div class="action">
        <div class="action__handler">
          <a href="#" class="link action__link">
            Go to product
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
        type: Array
    },
    containerClass: {
        type: String
    },
    itemClass: {
        type: String
    },
    currency: {
        type: String
    }
  }
}
</script>
