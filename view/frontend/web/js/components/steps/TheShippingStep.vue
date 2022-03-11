<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
    <h2>Shipping address</h2>
    <form @submit.prevent="goToNextStep">
      <CustomerEmailField v-if="!isCustomerLoggedIn" />
      <ShippingAddressForm />
      <BaseButton type="submit">
        Next Step
      </BaseButton>
    </form>
    <ShippingMethods />
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue'
import CustomerEmailField from '../CustomerEmailField.vue'
import ShippingAddressForm from '../ShippingAddressForm.vue'
import ShippingMethods from '../ShippingMethods.vue'
import useVuelidate from '@vuelidate/core'


import { mapState } from 'pinia'
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
      shippingMethodsReadyToSubmit: false,
      loader: false
    }
  },
  computed: {
    ...mapState(useStore, ['isCustomerLoggedIn']),
    ...mapState(useStore, ['step'])
  },
  methods: {
    async goToNextStep() {
      const result = await this.v$.$validate()
      console.log(result)
      if (result) {
        console.log(result)
      }

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
