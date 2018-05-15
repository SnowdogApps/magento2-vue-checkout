<template>
  <section class="shipping-address" v-if="step === 'shipping'">
    <h1>
      Shipping Step
    </h1>
    <hr>
    <h2>
      Shipping address
    </h2>
    <form @submit.prevent="onFormSubmit" class="shipping-address__form">
      <BaseInput
        v-model="customer.email"
        @input="checkIsEmailAvailable"
        label="Email"
        name="email"
        type="email"
        validate-type="required|email"
      />
      <span v-if="customer.email !== '' && !errors.has('email')  && !customer.emailAvailable">
        You already have an account with us. Sign in <a :href="loginUrl">here</a> or continue as guest.
      </span>
      <span v-else-if="customer.email !== '' && !errors.has('email') && customer.emailAvailable">
        You can create an account after checkout.
      </span>
      <hr>
      <AddressFields type="shipping_address" />
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
            type="radio"
            v-model="selectedShippingMethod"
            name="shipping-method"
            :value="method"
            :id="method.carrier_code"
            v-validate="'required'"
            data-vv-as="Shipping method"
          />
          <label
            :for="method.carrier_code"
          >
            <span class="label__text">
              {{ method.carrier_title }} - {{ method.method_title }}
            </span>

            <span class="label__price">
              {{ method.price_incl_tax | currency(currencyCode) }}
            </span>
          </label>

          <p v-show="errors.has('shipping-method')" class="input__message">
            {{ errors.first('shipping-method') }}
          </p>
        </div>
      </template>
      <template v-else>
        <p>
          In this country we don't handle any shipping methods.
        </p>
      </template>
      <BaseButton class="button" button-type="submit" text="Next Step"/>
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
    currencyCode () {
      return this.$store.getters.currencyCode
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
              console.log('Looks like there was a problem: \n', error)
            })
        }
      })
        .catch(() => {
          console.log('Error with process your Payment step and finalize your order - please try again later')
        })
    },
    onFormSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.commit('setCustomerEmail', this.customer.email)
          EventBus.$emit('save-address', 'shipping_address')
          this.$store.dispatch('setShippinInformation', this.selectedShippingMethod)
        }
      })
        .catch(() => {
          console.log('Error with process your Shipping step and process your order - please try again later')
        })
    }
  }
}
</script>
