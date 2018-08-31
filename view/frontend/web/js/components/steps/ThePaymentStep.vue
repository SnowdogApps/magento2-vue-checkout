<template>
  <section
    v-if="step === 'payment'"
    class="billing-address"
  >
    <h1>
      Review & Payments Step
    </h1>
    <hr>
    <h2>
      Billing Address
    </h2>

    <BaseCheckbox
      id="billing-address-same-as-shipping-address"
      v-model="billingAddress"
      label-class="label"
      field-class="checkbox shipping-address__field"
      input-class="shipping-address__checkbox"
      name="billing-address-same-as-shipping-address"
      text="My billing and shipping address are the same"
    />

    <form
      v-show="!billingAddress"
      class="billing-address__form"
    >
      <AddressFields type="billingAddress" />
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
        v-validate="'required'"
        v-model="selectedPaymentMethod"
        :value="method"
        :id="method.code"
        type="radio"
        name="payment-method"
        data-vv-as="Payment method"
      >
      <label :for="method.code">
        {{ method.title }}
      </label>

      <p
        v-show="errors.has('payment-method')"
        class="input__message"
      >
        {{ errors.first('payment-method') }}
      </p>
    </div>

    <DiscountCodeForm/>

    <BaseButton
      :loader="loader"
      text="Place order"
      @click.native="placeOrder"
    />
    <BaseButton
      text="Back"
      @click.native="changeStep('shipping')"
    />
  </section>
</template>

<script>
import AddressFields from '../AddressFields.vue'
import BaseButton from '../BaseButton.vue'
import BaseCheckbox from '../BaseCheckbox.vue'
import DiscountCodeForm from '../DiscountCodeForm.vue'
import EventBus from '../../event-bus'

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    DiscountCodeForm,
    AddressFields
  },
  data () {
    return {
      billingAddress: true,
      selectedPaymentMethod: null,
      loader: false
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
    }
  },
  methods: {
    changeStep (step) {
      if (!this.billingAddress) {
        EventBus.$emit('save-address', 'billingAddress')
      }
      this.$store.commit('setItem', {item: 'step', value: step})
    },
    placeOrder () {
      if (!this.billingAddress) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loader = true
            EventBus.$emit('save-address', 'billingAddress')
            this.$store.dispatch('getTotals')
            this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
              .then(() => {
                this.loader = false
              })
          }
        })
      } else {
        this.$store.commit('copyShippingAddress')
        this.$validator.validate('payment-method').then((result) => {
          if (result) {
            this.loader = true
            this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
              .then(() => {
                this.loader = false
              })
          }
        })
          .catch(() => {
            console.error('Error with finalize your order - please try again later')
          })
      }
    }
  }
}
</script>
