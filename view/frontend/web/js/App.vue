<template>
  <div class="checkout">
    <ProgressBar class="checkout__progress-bar"/>
    <main class="checkout__wrapper">
      <TheShippingStep/>
      <ThePaymentStep/>
      <TheSuccessStep/>
    </main>
    <aside class="checkout__sidebar">
      <ProductsList/>
      <TotalsData/>
    </aside>
  </div>
</template>

<script>
import TheShippingStep from './components/steps/TheShippingStep.vue'
import ThePaymentStep from './components/steps/ThePaymentStep.vue'
import TheSuccessStep from './components/steps/TheSuccessStep.vue'
import TotalsData from './components/TotalsData.vue'
import ProductsList from './components/ProductsList.vue'
import ProgressBar from './components/ProgressBar.vue'

export default {
  components: {
    TheShippingStep,
    ThePaymentStep,
    TheSuccessStep,
    TotalsData,
    ProductsList,
    ProgressBar
  },
  computed: {
    isCustomerLoggedIn () {
      return this.$store.getters.isCustomerLoggedIn
    },
    customerData () {
      return window.config.customerData
    }
  },
  mounted () {
    if (this.isCustomerLoggedIn) {
      this.$store.commit('setItem', {
        item: 'customer',
        value: this.customerData
      })
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="../assets/sass/main.scss" lang="scss"></style>
