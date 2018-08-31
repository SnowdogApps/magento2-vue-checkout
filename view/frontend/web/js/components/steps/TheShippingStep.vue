<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
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
      <ShippingMethods :shipping-methods="shippingMethods"/>
      <BaseButton
        :loader="loader"
        type="submit"
        text="Next Step"
      />
    </form>
  </section>
</template>

<script>
import AddressFields from '../AddressFields.vue'
import BaseButton from '../BaseButton.vue'
import BaseInput from '../BaseInput.vue'
import ShippingMethods from '../ShippingMethods.vue'
import EventBus from '../../event-bus'
import axios from 'axios'

export default {
  components: {
    AddressFields,
    BaseButton,
    BaseInput,
    ShippingMethods
  },
  data () {
    return {
      customer: {
        email: '',
        emailAvailable: false
      },
      loader: false
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
      this.$validator.validateAll().then(result => {
        if (result) {
          this.loader = true
          this.$store.commit('setCustomerEmail', this.customer.email)
          EventBus.$emit('save-address', 'shippingAddress')
          this.$store.dispatch('setShippinInformation').then(() => {
            this.loader = false
          })
          this.$store.dispatch('getTotals')
        }
      })
        .catch(error => {
          console.error('Error with process your Shipping step. \n', error)
        })
    }
  }
}
</script>
