<template>
  <div>
    <BaseLoader/>
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
import BaseLoader from './components/BaseLoader.vue'
import ProductsList from './components/ProductsList.vue'

export default {
  components: {
    TheShippingStep,
    ThePaymentStep,
    TheSuccessStep,
    ProductsList,
    BaseLoader
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
