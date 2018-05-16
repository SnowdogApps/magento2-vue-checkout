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
      <AddressFields type="billing_address" />
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

<script>
import AddressFields from '../AddressFields.vue'
import BaseButton from '../BaseButton.vue'
import BaseCheckbox from '../BaseCheckbox.vue'
import EventBus from '../../event-bus'

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    AddressFields
  },
  data () {
    return {
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
    currencyCode () {
      return this.$store.getters.currencyCode
    }
  },
  methods: {
    changeStep (step) {
      if (!this.billingAddress) {
        EventBus.$emit('save-address', 'billing_address')
      }
      this.$store.commit('setStep', step)
    },
    placeOrder () {
      if (!this.billingAddress) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            EventBus.$emit('save-address', 'billing_address')
            this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
          }
        })
      } else {
        this.$store.commit('copyShippingAddress')
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
