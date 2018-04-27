<template>
  <div>
    <BaseShippingStep/>
    <BasePaymentStep/>
    <BaseSuccessStep/>
    <BaseItems/>
  </div>
</template>

<style src="./assets/vue-multiselect.min.css"></style>

<script>
import BaseShippingStep from './components/steps/BaseShippingStep.vue'
import BasePaymentStep from './components/steps/BasePaymentStep.vue'
import BaseSuccessStep from './components/steps/BaseSuccessStep.vue'
import BaseItems from './components/BaseItems.vue'

export default {
  components: {
    BaseShippingStep,
    BasePaymentStep,
    BaseSuccessStep,
    BaseItems
  }
}
</script>
