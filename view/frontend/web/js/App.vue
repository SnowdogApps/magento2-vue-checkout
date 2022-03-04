<template>
  <div class="v-checkout">
    <ProgressBar class="v-checkout__progress-bar" />
    <main class="v-checkout__wrapper">
      <TheShippingStep />
    </main>
  </div>
</template>

<script>
import TheShippingStep from "./components/steps/TheShippingStep.vue";
// import ThePaymentStep from './components/steps/ThePaymentStep.vue'
// import TheSuccessStep from './components/steps/TheSuccessStep.vue'
// import TotalsData from './components/TotalsData.vue'
// import ProductsList from './components/ProductsList.vue'
import ProgressBar from "./components/ProgressBar.vue";

export default {
  components: {
    TheShippingStep,
    // ThePaymentStep,
    // TheSuccessStep,
    // TotalsData,
    // ProductsList,
    ProgressBar,
  },
  computed: {
    isCustomerLoggedIn() {
      return false;
      // return this.$store.getters.isCustomerLoggedIn
    },
  },
  // mounted () {
  //   if (this.isCustomerLoggedIn) {
  //     this.$store.dispatch('getCustomerData')
  //   }
  // }
};
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
