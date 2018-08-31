<template>
  <div class="checkout">
    <TheShippingStep/>
    <ThePaymentStep/>
    <TheSuccessStep/>
    <ProductsList/>
    <TotalsData/>
  </div>
</template>

<script>
import TheShippingStep from './components/steps/TheShippingStep.vue'
import ThePaymentStep from './components/steps/ThePaymentStep.vue'
import TheSuccessStep from './components/steps/TheSuccessStep.vue'
import TotalsData from './components/TotalsData.vue'
import ProductsList from './components/ProductsList.vue'

export default {
  components: {
    TheShippingStep,
    ThePaymentStep,
    TheSuccessStep,
    TotalsData,
    ProductsList
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
