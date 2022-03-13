<template>
  <div class="v-checkout">
    <ProgressBar class="v-checkout__progress-bar" />
    <main class="v-checkout__wrapper">
      <TheShippingStep />
    </main>
  </div>
</template>

<script>
import { useStore } from '@/store/index.js'
import { mapState, mapActions } from 'pinia'

import TheShippingStep from './components/steps/TheShippingStep.vue'
// import ThePaymentStep from './components/steps/ThePaymentStep.vue'
// import TheSuccessStep from './components/steps/TheSuccessStep.vue'
// import TotalsData from './components/TotalsData.vue'
// import ProductsList from './components/ProductsList.vue'
import ProgressBar from './components/ProgressBar.vue'

export default {
  components: {
    TheShippingStep,
    // ThePaymentStep,
    // TheSuccessStep,
    // TotalsData,
    // ProductsList,
    ProgressBar
  },
  computed: {
    ...mapState(useStore, ['isCustomerLoggedIn'])
  },
  mounted () {
    // TODO: check config.customerData object
    if (this.isCustomerLoggedIn) {
      this.fetchCustomerData()
    }
  },
  methods: {
    ...mapActions(useStore, ['fetchCustomerData'])
  }
}
</script>

<style>
.v-checkout {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

.v-checkout__progress-bar {
  flex: 1 100%;
}

.v-checkout__wrapper {
  flex: 1 calc(100% - 330px);
  max-width: calc(100% - 330px);
}

.v-checkout__sidebar {
  flex: 1 300px;
  max-width: 300px;
}
</style>
