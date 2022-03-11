<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
    <h2>Shipping address</h2>
    <form @submit.prevent="goToNextStep">
      <CustomerEmailField
        v-if="!isCustomerLoggedIn"
        ref="customerEmail"
        @valid="status => isCustomerEmailValid = status"
      />
      <ShippingAddressForm
        ref="shippingsAddressForm"
        @valid="status => isShippingAddressValid = status"
      />
      <BaseButton type="submit">
        Next Step
      </BaseButton>
    </form>
    <!-- <ShippingMethods
      ref="shippingsMethods"
      @ready="isReady => shippingMethodsReadyToSubmit = isReady"
    /> -->
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue'
import CustomerEmailField from '../CustomerEmailField.vue'
import ShippingAddressForm from '../ShippingAddressForm.vue'
// import ShippingMethods from '../ShippingMethods.vue'

import { mapState } from 'pinia'
import { useStore } from '@/store/index.js'

export default {
  components: {
    BaseButton,
    CustomerEmailField,
    ShippingAddressForm
    // ShippingMethods
  },
  data() {
    return {
      isCustomerEmailValid: false,
      isShippingAddressValid: false,
      shippingMethodsReadyToSubmit: false,
      loader: false
    }
  },
  computed: {
    ...mapState(useStore, ['isCustomerLoggedIn']),
    ...mapState(useStore, ['step'])
  },
  methods: {
    goToNextStep() {
        if (!this.isCustomerLoggedIn) {
          this.$refs.customerEmail.validate()
        }

        this.$refs.shippingsAddressForm.validate()
        console.log(this.isShippingAddressValid)
        // this.$refs.shippingsMethods.touch()
        // if (
        //   !this.shippingAddressReadyToSubmit ||
        //   !this.isShippingAddressValid ||
        //   (!this.isCustomerLoggedIn && !this.isCustomerEmailValid)
        // ) {
        //   return
        // }
        // this.loader = true
        // this.$store.dispatch('setShippinInformation').then(() => {
        //   this.loader = false
        // })
        // this.$store.dispatch('getTotals')
    }
  }
}
</script>
