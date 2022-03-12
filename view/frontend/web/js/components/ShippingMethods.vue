<template>
  <h2>Shipping methods</h2>
  <div
    v-if="shippingMethods.length"
    data-testid="shipping-methods"
  >
    <BaseRadioGroup
      v-model="v$.selectedMethod.$model"
      :validation="v$.selectedMethod"
      name="shipping-method"
      label-key="method_title"
      id-key="carrier_code"
      :options="shippingMethods"
      @update:model-value="setSelectedShippingMethod"
    />
  </div>
  <div v-else>
    <p>In this country we don't handle any shipping methods.</p>
  </div>
</template>

<script>
import BaseRadioGroup from './BaseRadioGroup.vue'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapState } from 'pinia'
import { useStore } from '@/store/index.js'

export default {
  emits: ['valid'],
  setup () {
    return { v$: useVuelidate() }
  },
  components: {
    BaseRadioGroup
  },
  data() {
    return {
      selectedMethod: {}
    }
  },
  validations: {
    selectedMethod: {
      required
    }
  },
  computed: {
    ...mapState(useStore, ['selectedShippingMethod', 'shippingMethods']),
    isValid () {
      return !this.v$.selectedMethod?.$invalid
    }
  },
  watch: {
    isValid (val) {
      this.$emit('valid', val)
    }
  },
  created() {
    this.selectedMethod = this.selectedShippingMethod
  },
  methods: {
    validate() {
      this.v$.selectedMethod.$touch()
    },
    reset () {
      this.v$.selectedMethod.$model = {}
      this.v$.selectedMethod.$reset()
    },
    setSelectedShippingMethod() {
      useStore().selectedShippingMethod = this.selectedMethod
    }
  }
}
</script>
