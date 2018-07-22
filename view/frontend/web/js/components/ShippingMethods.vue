<template>
  <div>
    <h2>
      Shipping methods
    </h2>
    <div
      v-if="shippingMethods.length"
      data-testid="shipping-methods"
    >
      <div
        v-for="method in shippingMethods"
        v-if="method.available"
        :key="method.carrier_code"
        :class="['input', {'input--error': errors.has('shipping-method') }]"
        data-testid="shipping-method"
      >
        <input
          v-validate="'required'"
          v-model="selectedShippingMethod"
          :value="method"
          :id="method.carrier_code"
          :data-testid="`method-radiobutton-${method.carrier_code}`"
          type="radio"
          name="shipping-method"
          data-vv-as="Shipping method"
          @change="setSelectedShippingMethod"
        >
        <label :for="method.carrier_code">
          <span class="label__text">
            {{ method.carrier_title }} - {{ method.method_title }}
          </span>

          <span class="label__price">
            {{ method.price_incl_tax | currency }}
          </span>
        </label>
      </div>
      <p
        v-if="errors.has('shipping-method')"
        class="input__message"
      >
        {{ errors.first('shipping-method') }}
      </p>
    </div>
    <div v-else>
      <p>
        In this country we don't handle any shipping methods.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['$validator'],
  props: {
    shippingMethods: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedShippingMethod: null
    }
  },
  methods: {
    setSelectedShippingMethod (val) {
      this.$store.commit(
        'setItem',
        {
          item: 'selectedShippingMethod',
          value: this.selectedShippingMethod
        }
      )
    }
  }
}
</script>
