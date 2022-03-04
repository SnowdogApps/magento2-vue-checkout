<template>
  <form>
    <h2>Payment methods</h2>
    <div v-if="paymentMethods.length">
      <div v-for="method in paymentMethods" :key="method.id">
        <input
          v-model="$v.selectedPaymentMethod.$model"
          :value="method"
          :id="method.code"
          type="radio"
          name="payment-method"
          @change="setSelectedPaymentMethod($event.target.value)"
        />
        <label :for="method.code">
          {{ method.title }}
        </label>
      </div>
      <span
        v-if="
          $v.selectedPaymentMethod.$error && !$v.selectedPaymentMethod.required
        "
      >
        This field is required!
      </span>
    </div>
    <div v-else>
      <p>In this country we don't handle any payment methods.</p>
    </div>
  </form>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      selectedPaymentMethod: null,
    };
  },
  validations: {
    selectedPaymentMethod: {
      required,
    },
  },
  computed: {
    paymentMethods() {
      return this.$store.state.paymentMethods;
    },
    ready() {
      return !this.$v.selectedPaymentMethod.$invalid;
    },
  },
  watch: {
    ready(val) {
      this.$emit("ready", val);
    },
  },
  methods: {
    touch() {
      this.$v.selectedPaymentMethod.$touch();
    },
    setSelectedPaymentMethod(val) {
      this.$store.commit("setItem", {
        item: "selectedPaymentMethod",
        value: this.selectedPaymentMethod,
      });
    },
  },
};
</script>
