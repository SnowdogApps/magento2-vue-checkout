<template>
  <form>
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
        :key="method.method_code"
        data-testid="shipping-method"
      >
        <input
          v-model="$v.selectedShippingMethod.$model"
          :value="method"
          :id="method.method_code"
          :data-testid="`method-radiobutton-${method.method_code}`"
          type="radio"
          name="shipping-method"
          data-vv-as="Shipping method"
          @change="setSelectedShippingMethod($event.target.value)"
        >
        <label :for="method.method_code">
          <span class="label__text">
            {{ method.carrier_title }} - {{ method.method_title }}
          </span>

          <span class="label__price">
            {{ method.price_incl_tax | currency }}
          </span>
        </label>
      </div>
      <span
        v-if="
          $v.selectedShippingMethod.$error
            && !$v.selectedShippingMethod.required
        "
      >
        This field is required!
      </span>
    </div>
    <div v-else>
      <p>
        In this country we don't handle any shipping methods.
      </p>
    </div>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
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
  validations: {
    selectedShippingMethod: {
      required
    }
  },
  computed: {
    currentShippingMethod () {
      return this.$store.state.selectedShippingMethod
    },
    ready () {
      return !this.$v.selectedShippingMethod.$invalid
    }
  },
  watch: {
    ready (val) {
      this.$emit('ready', val)
    }
  },
  created () {
    this.selectedShippingMethod = this.currentShippingMethod
  },
  methods: {
    touch () {
      this.$v.selectedShippingMethod.$touch()
    },
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
