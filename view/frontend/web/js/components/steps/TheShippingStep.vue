<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
    <h2>Shipping address</h2>
    <form class="shipping-address__form">
      <BaseInput
        v-model.trim="$v.customer.email.$model"
        :validation="$v.customer.email"
        label="Email"
        name="email"
        type="email"
        @input="checkIsEmailAvailable"
      />
      <span
        v-if="emailAvailabilityMessage"
        v-html="emailAvailabilityMessage"
      />
      <hr>
      <div>
        <BaseInput
          v-model="$v.address.firstname.$model"
          :validation="$v.address.firstname"
          label="First name"
          name="firstname"
        />
        <BaseInput
          v-model="$v.address.lastname.$model"
          :validation="$v.address.lastname"
          label="Last name"
          name="lastname"
        />
        <BaseInput
          v-model="$v.address.telephone.$model"
          :validation="$v.address.telephone"
          label="Phone Number"
          name="telephone"
          type="tel"
        />
        <BaseInput
          v-model="$v.address.street0.$model"
          :validation="$v.address.street0"
          label="Street Address"
          name="street0"
        />
        <BaseInput
          v-model="address.street1"
          label="Street Address"
          name="street1"
        />
        <div>
          <label for="country">
            Select Country
          </label>
          <multiselect
            id="country"
            v-model="$v.address.country_id.$model"
            :options="countries"
            :allow-empty="false"
            :show-labels="false"
            name="country"
            label="label"
            placeholder="Select country"
            @input="onCountryChange"
          />
        </div>
        <BaseInput
          v-model="$v.address.city.$model"
          :validation="$v.address.city"
          label="City"
          name="city"
        />
        <BaseInput
          v-model="$v.address.postcode.$model"
          :validation="$v.address.postcode"
          label="Zip/Postal Code"
          name="postcode"
        />
        <BaseInput
          v-if="!regions.length"
          v-model="$v.address.region.$model"
          :validation="$v.address.region"
          label="State/Province"
          name="region"
        />
        <div v-if="regions.length">
          <label for="region_id">
            Select State/Province
          </label>
          <multiselect
            id="region_id"
            v-model="$v.address.region_id.$model"
            :validation="$v.address.region_id"
            :options="regions"
            :allow-empty="false"
            :show-labels="false"
            name="region_id"
            label="label"
            placeholder="Select State/Province"
          />
        </div>
        <BaseInput
          v-model="address.company"
          label="Company"
          name="company"
        />
      </div>
    </form>
    <ShippingMethods
      ref="shippingsMethods"
      :shipping-methods="shippingMethods"
      @ready="isReady => shippingMethodsReadyToSubmit = isReady"
    />
    <BaseButton
      :loader="loader"
      text="Next Step"
      @click.native="goToNextStep()"
    />
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue'
import BaseInput from '../BaseInput.vue'
import ShippingMethods from '../ShippingMethods.vue'
import Multiselect from 'vue-multiselect'
import axios from 'axios'
import countries from '../../data/countries.json'
import { required, email, requiredIf } from 'vuelidate/lib/validators'

export default {
  components: {
    BaseButton,
    BaseInput,
    Multiselect,
    ShippingMethods
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
        region: '',
        region_id: '',
        company: ''
      },
      customer: {
        email: '',
        emailAvailable: false
      },
      countries,
      shippingMethodsReadyToSubmit: false,
      loader: false
    }
  },
  validations: {
    customer: {
      email: {
        required,
        email
      }
    },
    address: {
      firstname: {
        required
      },
      lastname: {
        required
      },
      telephone: {
        required
      },
      street0: {
        required
      },
      country_id: {
        required
      },
      city: {
        required
      },
      postcode: {
        required
      },
      region: {
        required: requiredIf(function () {
          return this.regions.length === 0
        })
      },
      region_id: {
        required: requiredIf(function () {
          return this.regions.length > 0
        })
      }
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
      if (this.customer.email !== '' && !this.$v.customer.email.$error) {
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
    regions () {
      if (this.address.country_id.value === null) {
        return []
      } else {
        return this.$store.getters.regionsByCountryId(this.address.country_id.value)
      }
    },
    loginUrl () {
      return this.baseUrl + 'customer/account/login/'
    }
  },
  methods: {
    checkIsEmailAvailable () {
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
    },
    onCountryChange () {
      this.$store.dispatch('updateShippingMethods', this.address.country_id.value)
    },
    goToNextStep () {
      this.$refs.shippingsMethods.touch()
      this.$v.$touch()
      if (this.$v.$invalid || !this.shippingMethodsReadyToSubmit) {
        return
      }

      this.loader = true
      this.$store.commit('setCustomerEmail', this.customer.email)
      this.$store.commit(
        'setAddress',
        { type: 'shippingAddress', address: this.address }
      )
      this.$store.dispatch('setShippinInformation').then(() => {
        this.loader = false
      })
      this.$store.dispatch('getTotals')
    }
  }
}
</script>

<style lang="scss">
  .input {
    &--error {
      & .input__message {
        display: block;
        color: red;
      }
    }
  }

  input[type="text"] {
    &.multiselect__input {
      height: auto;
      border: none;
    }
  }

</style>
