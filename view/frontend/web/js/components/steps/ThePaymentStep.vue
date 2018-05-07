<template>
  <section class="billing-address" v-if="step === 'payment'">
    <h1>
      Review & Payments Step
    </h1>
    <hr>
    <h2>
      Billing Address
    </h2>

    <BaseCheckbox
      v-model="billingAddress"
      id="billing-address-same-as-shipping-address"
      label-class="label"
      field-class="checkbox shipping-address__field"
      input-class="shipping-address__checkbox"
      name="billing-address-same-as-shipping-address"
      text="My billing and shipping address are the same"
    />

    <form class="billing-address__form" v-show="!billingAddress">
      <AddressFields :address="address" type="billing" />
    </form>
    <h2>
      Payment methods
    </h2>
    <div
      v-for="method in paymentMethods"
      :key="method.id"
      :class="{'input--error': errors.has('payment-method') }"
    >
      <input
        type="radio"
        v-model="selectedPaymentMethod"
        name="payment-method"
        :value="method"
        :id="method.code"
        v-validate="'required'"
        data-vv-as="Payment method"
      />
      <label :for="method.code">
        {{ method.title }}
      </label>

      <p v-show="errors.has('payment-method')" class="input__message">
        {{ errors.first('payment-method') }}
      </p>
    </div>
    <BaseButton
      class="button"
      button-type="button"
      text="Place order"
      @click.native="placeOrder"
    />

    <BaseButton
      class="button"
      button-type="button"
      text="Back"
      @click.native="changeStep('shipping')"
    />
  </section>
</template>

<style lang="scss" scoped>
.input {
  &--error {
    & .input__message {
      display: block;
      color: red;
    }
  }
}
</style>

<script>
import AddressFields from '../AddressFields.vue'
import BaseButton from '../BaseButton.vue'
import BaseCheckbox from '../BaseCheckbox.vue'
import BaseInput from '../BaseInput.vue'
import BaseSelect from '../BaseSelect.vue'

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    AddressFields
  },
  data () {
    return {
      address: {
        firstname: '',
        lastname: '',
        telephone: '',
        street0: '',
        street1: '',
        country_id: '',
        city: '',
        postcode: '',
        region_id: '',
        region: '',
        company: ''
      },
      billingAddress: true,
      selectedPaymentMethod: null
    }
  },
  computed: {
    cartId () {
      return this.$store.getters.cartId
    },
    step () {
      return this.$store.state.step
    },
    paymentMethods () {
      return this.$store.state.paymentMethods
    },
    shippingInformation () {
      return this.$store.state.shippingInformation
    },
    currencyCode () {
      return this.$store.getters.currencyCode
    }
  },
  methods: {
    changeStep (step) {
      this.$store.commit('setStep', step)
    },
    placeOrder () {
      if (!this.billingAddress) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store.commit('setAddress', {
              type: 'billing_address',
              address: this.address
            })
            this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
          }
        })
      } else {
        this.$validator.validate('payment-method').then((result) => {
          if (result) {
            this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
          }
        })
          .catch(() => {
            console.log('Error with process your Payment step and finalize your order - please try again later')
          })
      }
    }
  }
}
</script>
