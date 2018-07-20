<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
    <h1>
      Shipping Step
    </h1>
    <hr>
    <h2>
      Shipping address
    </h2>
    <form
      class="shipping-address__form"
      @submit.prevent="onFormSubmit"
    >
      <BaseInput
        v-model="customer.email"
        label="Email"
        name="email"
        type="email"
        validate-type="required|email"
        @input="checkIsEmailAvailable"
      />
      <span
        v-if="emailAvailabilityMessage"
        v-html="emailAvailabilityMessage"
      />
      <hr>
      <AddressFields type="shippingAddress" />
      <h2>
        Shipping methods
      </h2>
      <template v-if="shippingMethods.length > 0">
        <div
          v-for="method in shippingMethods"
          v-if="method.available"
          :key="method.id"
          :class="{'input--error': errors.has('shipping-method') }"
        >
          <input
            v-validate="'required'"
            v-model="selectedShippingMethod"
            :value="method"
            :id="method.carrier_code"
            type="radio"
            name="shipping-method"
            data-vv-as="Shipping method"
            @change="setSelectedShippingMethod"
          >
          <label :for="method.carrier_code">
            <span class="label__text">
              {{ method.carrier_title }} - {{ method.method_title }}
            </span>

            <span class="label__price">
              {{ method.price_incl_tax | currency }}
            </span>
          </label>
        </div>
        <p
          v-show="errors.has('shipping-method')"
          class="input__message"
        >
          {{ errors.first('shipping-method') }}
        </p>
      </template>
      <template v-else>
        <p>
          In this country we don't handle any shipping methods.
        </p>
      </template>

      <BaseButton
        type="submit"
        text="Next Step"
        with-loader
      />
    </form>
  </section>
</template>

<script>
import AddressFields from '../AddressFields.vue'
import BaseButton from '../BaseButton.vue'
import BaseInput from '../BaseInput.vue'
import EventBus from '../../event-bus'
import axios from 'axios'

export default {
  components: {
    BaseButton,
    BaseInput,
    AddressFields
  },
  data () {
    return {
      customer: {
        email: '',
        emailAvailable: false
      },
      selectedShippingMethod: null
    }
  },
  computed: {
    baseUrl () {
      return this.$store.state.baseUrl
    },
    step () {
      return this.$store.state.step
    },
    shippingMethods () {
      return this.$store.state.shippingMethods
    },
    emailAvailabilityMessage () {
      if (this.customer.email !== '' && !this.errors.has('email')) {
        if (this.customer.emailAvailable) {
          return `You can create an account after checkout.`
        } else {
          return `
            You already have an account with us.
            Sign in <a href="${this.loginUrl}">here</a> or continue as guest.
          `
        }
      } else {
        return false
      }
    },
    loginUrl () {
      return this.baseUrl + 'customer/account/login/'
    }
  },
  methods: {
    setSelectedShippingMethod (val) {
      this.$store.commit(
        'setItem',
        {item: 'selectedShippingMethod', value: this.selectedShippingMethod}
      )
    },
    checkIsEmailAvailable () {
      this.$validator.validate('email').then((result) => {
        if (result) {
          const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
              'customerEmail': this.customer.email
            }),
            url: `${this.baseUrl}rest/V1/customers/isEmailAvailable`
          }

          axios(options)
            .then(({data}) => {
              this.customer.emailAvailable = data
            })
            .catch(error => {
              console.error('Looks like there was a problem: \n', error)
            })
        }
      })
        .catch(error => {
          console.error('Error with checking email availability. \n', error)
        })
    },
    onFormSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.commit('setItem', {item: 'loader', value: true})
          this.$store.commit('setCustomerEmail', this.customer.email)
          EventBus.$emit('save-address', 'shippingAddress')
          this.$store.dispatch('setShippinInformation')
        }
      })
        .catch(error => {
          console.error('Error with process your Shipping step. \n', error)
        })
    }
  }
}
</script>
