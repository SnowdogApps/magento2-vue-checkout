<template>
  <section v-if="step === 'shipping'" class="shipping-address">
    <h2>Shipping address</h2>
    <form>
      <CustomerEmailField v-if="!isCustomerLoggedIn" ref="customerEmail" />
      <!-- <ShippingAddressForm
        ref="shippingsAddressForm"
        @ready="isReady => shippingAddressReadyToSubmit = isReady"
      /> -->
    </form>
    <!-- <ShippingMethods
      ref="shippingsMethods"
      @ready="isReady => shippingMethodsReadyToSubmit = isReady"
    /> -->
    <!-- <BaseButton
      :loader="loader"
      text="Next Step"
      @click.native="goToNextStep()"
    /> -->
  </section>
</template>

<script>
// import BaseButton from '../BaseButton.vue'
import CustomerEmailField from '../CustomerEmailField.vue';
// import ShippingAddressForm from '../ShippingAddressForm.vue'
// import ShippingMethods from '../ShippingMethods.vue'

export default {
  components: {
    // BaseButton,
    CustomerEmailField,
    // ShippingAddressForm,
    // ShippingMethods
  },
  data() {
    return {
      customerEmailReadyToSubmit: false,
      shippingMethodsReadyToSubmit: false,
      shippingAddressReadyToSubmit: false,
      loader: false,
    };
  },
  computed: {
    step() {
      return 'shipping';
      // return this.$store.state.step
    },
    isCustomerLoggedIn() {
      return false;
      // return this.$store.getters.isCustomerLoggedIn
    },
  },
  methods: {
    goToNextStep() {
      if (!this.isCustomerLoggedIn) {
        this.$refs.customerEmail.touch();
      }

      this.$refs.shippingsAddressForm.touch();
      this.$refs.shippingsMethods.touch();

      if (
        !this.shippingAddressReadyToSubmit ||
        !this.shippingMethodsReadyToSubmit ||
        (!this.isCustomerLoggedIn && !this.customerEmailReadyToSubmit)
      ) {
        return;
      }

      this.loader = true;

      this.$store.dispatch('setShippinInformation').then(() => {
        this.loader = false;
      });

      this.$store.dispatch('getTotals');
    },
  },
};
</script>
