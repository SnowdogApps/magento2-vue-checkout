<template>
  <form>
    <h2>Shipping methods</h2>
    <div
      v-if="shippingMethods.length"
      data-testid="shipping-methods"
    >
      <!-- v-if="method.available" -->
      <div
        v-for="method in shippingMethods"
        :key="method.method_code"
      >
        <!-- <input
          :id="method.method_code"
          v-model="$v.selectedMethod.$model"
          :value="method"
          :data-testid="`method-radiobutton-${method.method_code}`"
          type="radio"
          name="shipping-method"
          @change="setSelectedShippingMethod($event.target.value)"
        > -->
        <label :for="method.method_code">
          <span class="label__text">
            {{ method.carrier_title }} - {{ method.method_title }}
          </span>

          <!-- <span class="label__price">
            {{ method.price_incl_tax | currency }}
          </span> -->
        </label>
      </div>
      <!-- <span
        v-if="
          $v.selectedShippingMethod.$error &&
            !$v.selectedShippingMethod.required
        "
      >
        This field is required!
      </span> -->
    </div>
    <div v-else>
      <p>In this country we don't handle any shipping methods.</p>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapState } from 'pinia'
import { useStore } from '@/store/index.js'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      selectedMethod: null
    }
  },
  validations: {
    selectedShippingMethodModel: {
      required
    }
  },
  computed: {
    ...mapState(useStore, ['selectedShippingMethod', 'shippingMethods'])
    // ready() {
    //   return !this.$v.selectedShippingMethod.$invalid
    // }
  },
  // watch: {
  //   ready(val) {
  //     this.$emit("ready", val);
  //   },
  // },
  created() {
    this.selectedMethod = this.selectedShippingMethod
  }
  // methods: {
  //   touch() {
  //     this.$v.selectedShippingMethod.$touch()
  //   },
  //   setSelectedShippingMethod() {
  //     this.$store.commit('setItem', {
  //       item: 'selectedShippingMethod',
  //       value: this.selectedShippingMethod
  //     })
  //   }
  // }
}
</script>
