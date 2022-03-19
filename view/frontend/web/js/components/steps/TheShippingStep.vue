<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
    <h2>Shipping address</h2>
    <form @submit.prevent="goToNextStep">
      <CustomerEmailField v-if="!isCustomerLoggedIn" />
      <ShippingAddressForm @update-country="resetShippingMethodsValidation" />
    </form>
    <ShippingMethods
      ref="shippingMethods"
      @valid="status => isShippingMethodValid = status"
    />
    <BaseButton
      type="button"
      @click="goToNextStep"
    >
      Next Step
    </BaseButton>
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue'
import CustomerEmailField from '../CustomerEmailField.vue'
import ShippingAddressForm from '../ShippingAddressForm.vue'
import ShippingMethods from '../ShippingMethods.vue'
import useVuelidate from '@vuelidate/core'

import { mapState, mapActions } from 'pinia'
import { useStore } from '@/store/index.js'

export default {
  setup: () => ({ v$: useVuelidate() }),
  components: {
    BaseButton,
    CustomerEmailField,
    ShippingAddressForm,
    ShippingMethods
  },
  data() {
    return {
      isCustomerEmailValid: false,
      isShippingAddressValid: false,
      isShippingMethodValid: false,
      loader: false
    }
  },
  computed: {
    ...mapState(useStore, ['isCustomerLoggedIn']),
    ...mapState(useStore, ['step'])
  },
  methods: {
    ...mapActions(useStore, ['setShippinInformation']),
    resetShippingMethodsValidation () {
      // TODO: add loader
      this.$refs.shippingMethods.reset()
    },
    async goToNextStep() {
      const isFormValid = await this.v$.$validate()
       await this.$refs.shippingMethods.validate()

      if (isFormValid & this.isShippingMethodValid) {
        // TODO: add loader
        // this.loader = true
        await this.setShippinInformation()
        // TODO: add loader
        // this.loader = false
      }
    }
  }
}
</script>
