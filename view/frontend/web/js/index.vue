<template>
  <div>
    <TheShippingStep/>
    <ThePaymentStep/>
    <TheSuccessStep/>
    <ProductsList/>
  </div>
</template>

<script>
import TheShippingStep from './components/steps/TheShippingStep.vue'
import ThePaymentStep from './components/steps/ThePaymentStep.vue'
import TheSuccessStep from './components/steps/TheSuccessStep.vue'
import ProductsList from './components/ProductsList.vue'

export default {
  components: {
    TheShippingStep,
    ThePaymentStep,
    TheSuccessStep,
    ProductsList
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
