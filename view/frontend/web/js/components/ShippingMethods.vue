<template>
  <div
    v-if="options.length > 0"
    :class="containerClass"
  >
    <template v-for="option in options">
      <div
        v-if="option.available"
        :key="option.id"
        :class="fieldClass"
      >
        <input
          :id="option.carrier_code"
          :name="name"
          :value="option.carrier_code"
          :class="inputClass"
          :data-method-code="option.method_code"
          type="radio"
        >
        <label
          :class="labelClass"
          :for="option.carrier_code"
        >
          <span class="label__text">
            {{ option.carrier_title }} - {{ option.method_title }}
          </span>

          <span class="label__price">
            {{ option.price_incl_tax | currency }}
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
  inject: ['$validator'],
  props: {
    options: {
      type: Array,
      required: true
    },
    labelClass: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    containerClass: {
      type: String,
      required: true
    },
    fieldClass: {
      type: String,
      required: true
    },
    inputClass: {
      type: String,
      required: true
    }
  }
}
</script>
