<template>
  <div>
    <BaseShippingStep/>
    <BasePaymentStep/>
    <BaseSummaryStep/>
    <BaseSuccessStep/>
    <BaseItems/>
  </div>
</template>

<script>
import BaseShippingStep from './components/steps/BaseShippingStep.vue'
import BasePaymentStep from './components/steps/BasePaymentStep.vue'
import BaseSummaryStep from './components/steps/BaseSummaryStep.vue'
import BaseSuccessStep from './components/steps/BaseSuccessStep.vue'
import BaseItems from './components/BaseItems.vue'

export default {
  components: {
    BaseShippingStep,
    BasePaymentStep,
    BaseSummaryStep,
    BaseSuccessStep,
    BaseItems
  }
}
</script>
