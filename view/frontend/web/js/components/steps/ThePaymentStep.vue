<template>
  <section
    class="billing-address"
    v-if="step === 'payment'"
  >
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
        :validate-type="!regions.length ? 'required' : ''"
        type="text"
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
import BaseButton from '../BaseButton.vue'
import BaseCheckbox from '../BaseCheckbox.vue'
import BaseInput from '../BaseInput.vue'
import countries from '../../data/countries.json'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
    Multiselect
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
      countries,
      countryWatcher: '',
      regionWatcher: '',
      regions: [],
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
    onCountryChange (selectedOption) {
      this.regions = this.$store.getters.regionsByCountryId(this.address.country_id)
    },
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
