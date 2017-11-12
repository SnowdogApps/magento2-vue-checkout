<template>
  <div
    class="summary"
    :class="containerClass"
  >
    <div class="summary__item">
      <p class="summary__text">
        Qty of ordered items:
        <strong>
          {{ itemsQty | quantity }}
        </strong>
      </p>
    </div>

    <template v-if="discountAmout">
      <div class="summary__item">
        <p class="summary__text">
          Discount amount:
          <strong>
            {{ discountAmout | currency }}
          </strong>
        </p>
      </div>
    </template>

    <div
      class="summary__item"
      :class="itemClass"
      v-for="item in items"
      :key="item.id"
    >
      <p class="summary__name">
        {{ item.title }}

        <strong>
          {{ item.value | currency }} {{ currencyCode }}
        </strong>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    containerClass: {
      type: String
    },
    itemClass: {
      type: String
    },
    items: {
      type: Array
    },
    discountAmout: {
      type: Number
    },
    itemsQty: {
      type: Number
    },
    currencyCode: {
      type: String
    }
  }
}
</script>
