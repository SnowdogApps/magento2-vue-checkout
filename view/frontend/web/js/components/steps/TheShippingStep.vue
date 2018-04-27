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
      <span v-if="customer.email !== '' && !customer.emailAvailable">
        You already have an account with us. Sign in <a :href="loginUrl">here</a> or continue as guest.
      </span>
      <span v-else-if="customer.email !== '' && customer.emailAvailable">
        You can create an account after checkout.
      </span>
      <hr>
      <BaseInput
        v-model="address.firstname"
        label="First name"
        name="firstname"
        type="text"
        validate-type="required"
      />
      <BaseInput
        v-model="address.lastname"
        label="Last name"
        name="lastname"
        type="text"
        validate-type="required"
      />
      <BaseInput
        v-model="address.telephone"
        label="Phone Number"
        name="telephone"
        type="tel"
        validate-type="required"
      />
      <BaseInput
        v-model="address.street0"
        label="Street Address"
        name="street[0]"
        type="text"
        validate-type="required"
      />
      <BaseInput
        v-model="address.street1"
        label="Street Address"
        name="street[1]"
        type="text"
      />
      <div :class="{'input--error': errors.has('country') }">
        <label for="country">
          Select Country
        </label>

        <multiselect
          v-model="countryWatcher"
          v-validate="'required'"
          :options="countries"
          :allow-empty="false"
          :show-labels="false"
          data-vv-as="Country"
          id="country"
          name="country"
          track-by="value"
          label="label"
          placeholder="Select country"
        />

        <span v-show="errors.has('country')" class="input__message">
          {{ errors.first('country') }}
        </span>
      </div>
      <BaseInput
        v-model="address.city"
        label="City"
        name="city"
        type="text"
        validate-type="required"
      />
      <BaseInput
        v-model="address.postcode"
        label="Zip/Postal Code"
        name="postcode"
        type="text"
        validate-type="required"
      />
      <BaseInput
        v-model="address.region"
        v-if="!regions.length"
        label="State/Province"
        name="region"
        type="text"
        :validate-type="!regions.length ? 'required' : ''"
      />
      <div v-if="regions.length" :class="{'input--error': errors.has('region') }">
        <label>
          Select State/Province
        </label>

        <multiselect
          v-model="regionWatcher"
          v-validate="!regions.length ? 'required' : ''"
          :options="regions"
          :allow-empty="false"
          :show-labels="false"
          data-vv-as="Region"
          id="region"
          name="region"
          track-by="value"
          label="label"
          placeholder="Select State/Province"
        />

        <span v-show="errors.has('region')" class="input__message">
          {{ errors.first('region') }}
        </span>
      </div>
      <BaseInput
        v-model="address.company"
        label="Company"
        name="company"
        type="text"
      />

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
import BaseButton from '../BaseButton.vue'
import BaseInput from '../BaseInput.vue'
import ShippingMethods from '../ShippingMethods.vue'
import countries from '../../data/countries.json'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    BaseButton,
    BaseInput,
    ShippingMethods,
    Multiselect
  },
  data () {
    return {
      customer: {
        email: '',
        emailAvailable: false
      },
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
      countries,
      countryWatcher: '',
      regionWatcher: '',
      regions: [],
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
      fetch(
        `${this.baseUrl}rest/V1/customers/isEmailAvailable`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'customerEmail': this.customer.email
          })
        }
      )
        .then(response => {
          if (response.ok) {
            return response
          }
          throw Error(response.statusText)
        })
        .then(response => {
          return response.json()
        })
        .then(response => {
          this.customer.emailAvailable = response
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error)
        })
    },
    onCountryChange (selectedOption) {
      this.regions = this.$store.getters.regionsByCountryId(this.address.country_id)
      this.$store.dispatch('updateShippingMethods', this.address.country_id)
    },
    onFormSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.commit('setCustomerEmail', this.customer.email)
          this.$store.commit('setAddress', { type: 'shipping_address', address: this.address })
          this.$store.commit('setShippinInformation', this.selectedShippingMethod)
          this.$store.dispatch('setShippinInformation')
        }
      })
        .catch(() => {
          console.log('Error with process your Shipping step and process your order - please try again later')
        })
    }
  },
  watch: {
    countryWatcher (newCountry) {
      this.address.country_id = newCountry.value
      this.regionWatcher = ''
      this.onCountryChange()
    },
    regionWatcher (newRegion) {
      this.address.region_id = newRegion.value
    }
  }
}
</script>
