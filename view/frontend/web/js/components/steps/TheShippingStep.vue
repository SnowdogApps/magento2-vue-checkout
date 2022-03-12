<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
    <h2>Shipping address</h2>
    <form @submit.prevent="goToNextStep">
      <CustomerEmailField v-if="!isCustomerLoggedIn" />
      <ShippingAddressForm @update-country="refreshShippingComponent" />
    </form>
    <ShippingMethods
      ref="shippingsMethods"
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
      isShippingMethodValid: false,
      loader: false
    }
  },
  computed: {
    ...mapState(useStore, ['isCustomerLoggedIn']),
    ...mapState(useStore, ['step'])
  },
  methods: {
    refreshShippingComponent () {
      // TODO: add loader for main button
      this.$refs.shippingsMethods.reset()
    },
    async goToNextStep() {
      const isFormValid = await this.v$.$validate()
       await this.$refs.shippingsMethods.validate()

      if (isFormValid & this.isShippingMethodValid) {
        console.log('elo')
        // this.loader = true
        // this.$store.dispatch('setShippinInformation').then(() => {
        //   this.loader = false
        // })
        // this.$store.dispatch('getTotals')
      }
    }
  }
}
</script>
