<template>
  <section v-if="step === 'payment'" class="billing-address">
    <h2>Billing Address</h2>
    <BaseCheckbox
      id="billing-address-same-as-shipping-address"
      v-model="billingAndShippingAddressTheSame"
      label-class="label"
      field-class="checkbox shipping-address__field"
      input-class="shipping-address__checkbox"
      name="billing-address-same-as-shipping-address"
      text="My billing and shipping address are the same"
    />
    <AddressData
      v-if="billingAndShippingAddressTheSame && billingAddress !== null"
      :address="billingAddress"
    />
    <div v-else>
      <template v-if="editBillingAddress">
        <BillingAddressForm @hideAddressForm="editBillingAddress = false" />
        <BaseButton text="Cancel" @click.native="toggleBillingAddress()" />
      </template>
      <div v-else>
        <AddressData
          v-if="newBillingAddress !== null"
          :address="newBillingAddress"
        />
        <BaseButton text="Edit Address" @click.native="editAddress" />
      </div>
    </div>
    <PaymentMethods
      ref="paymentMethods"
      @ready="(isReady) => (paymentMethodsReadyToSubmit = isReady)"
    />
    <DiscountCodeForm />
    <BaseButton
      :loader="loader"
      :disabled="disabledPlaceOrder"
      text="Place order"
      @click.native="placeOrder"
    />
    <BaseButton text="Back" @click.native="changeStep('shipping')" />
  </section>
</template>

<script>
import AddressData from "../AddressData.vue";
import BaseButton from "../BaseButton.vue";
import BaseCheckbox from "../BaseCheckbox.vue";
import BillingAddressForm from "../BillingAddressForm.vue";
import DiscountCodeForm from "../DiscountCodeForm.vue";
import PaymentMethods from "../PaymentMethods.vue";

export default {
  components: {
    AddressData,
    BaseButton,
    BaseCheckbox,
    BillingAddressForm,
    DiscountCodeForm,
    PaymentMethods,
  },
  data() {
    return {
      billingAndShippingAddressTheSame: true,
      editBillingAddress: true,
      selectedPaymentMethod: null,
      paymentMethodsReadyToSubmit: false,
      loader: false,
    };
  },
  computed: {
    billingAddress() {
      return this.$store.state.billingAddress;
    },
    newBillingAddress() {
      return this.$store.state.newBillingAddress;
    },
    step() {
      return this.$store.state.step;
    },
    paymentMethods() {
      return this.$store.state.paymentMethods;
    },
    disabledPlaceOrder() {
      return (
        (!this.billingAndShippingAddressTheSame && this.editBillingAddress) ||
        (!this.billingAndShippingAddressTheSame &&
          this.newBillingAddress === null)
      );
    },
  },
  methods: {
    toggleBillingAddress() {
      this.billingAndShippingAddressTheSame =
        !this.billingAndShippingAddressTheSame;
    },
    editAddress() {
      this.editBillingAddress = true;
    },
    changeStep(step) {
      this.$store.commit("setItem", { item: "step", value: step });
    },
    placeOrder() {
      this.$refs.paymentMethods.touch();
      if (!this.paymentMethodsReadyToSubmit) {
        return;
      }

      let billingAddress = null;

      if (this.billingAndShippingAddressTheSame) {
        billingAddress = this.billingAddress;
      } else {
        billingAddress = this.newBillingAddress;
      }

      this.loader = true;
      this.$store.dispatch("placeOrder", billingAddress).then(() => {
        this.loader = false;
      });
    },
  },
};
</script>
