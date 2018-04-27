<template>
  <div>
    <TheShippingStep/>
    <ThePaymentStep/>
    <TheSuccessStep/>
    <BaseItems/>
  </div>
</template>

<script>
import TheShippingStep from './components/steps/TheShippingStep.vue'
import ThePaymentStep from './components/steps/ThePaymentStep.vue'
import TheSuccessStep from './components/steps/TheSuccessStep.vue'
import BaseItems from './components/BaseItems.vue'

export default {
  components: {
    TheShippingStep,
    ThePaymentStep,
    TheSuccessStep,
    BaseItems
  }
}
</script>
