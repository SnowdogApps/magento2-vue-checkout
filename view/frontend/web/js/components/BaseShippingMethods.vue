<template>
  <div :class="containerClass">
    <template v-for="option in options" v-if="options.length > 0">
      <div
        v-if="option.available"
        :key="option.id"
        :class="fieldClass"
      >
        <input
          type="radio"
          :id="option.carrier_code"
          :name="name"
          :value="option.carrier_code"
          :class="inputClass"
          :data-method-code="option.method_code"
        />

        <label
          :class="labelClass"
          :for="option.carrier_code"
        >
          <span class="label__text">
            {{ option.carrier_title }} - {{ option.method_title }}
          </span>

          <span class="label__price">
              {{ option.price_incl_tax | currency }} {{ currencyCode }}
          </span>
        </label>
      </div>
    </template>

    <template v-if="options.length === 0">
      <p>
        In this country we don't handle any shipping methods.
      </p>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array
    },
    labelClass: {
      type: String
    },
    name: {
      type: String
    },
    containerClass: {
      type: String
    },
    fieldClass: {
      type: String
    },
    inputClass: {
      type: String
    },
    currencyCode: {
      type: String
    }
  },
  filters: {
    currency(value) {
      return parseFloat(value).toFixed(2);
    }
  }
}
</script>
