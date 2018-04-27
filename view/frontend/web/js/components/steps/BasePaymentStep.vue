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
      />
      <BaseInput
        v-model="address.lastname"
        label="Last name"
        name="lastname"
        type="text"
      />
      <BaseInput
        v-model="address.telephone"
        label="Phone Number"
        name="telephone"
        type="tel"
      />
      <BaseInput
        v-model="address.street0"
        label="Street Address"
        name="street[0]"
        type="text"
      />
      <BaseInput
        v-model="address.street1"
        label="Street Address"
        name="street[1]"
        type="text"
      />
      <label>
        Select Country
      </label>
      <multiselect
        v-model="countryWatcher"
        :options="countries"
        :allow-empty="false"
        :show-labels="false"
        track-by="value"
        label="label"
        placeholder="Select country"
      />
      <BaseInput
        v-model="address.city"
        label="City"
        name="city"
        type="text"
      />
      <BaseInput
        v-model="address.postcode"
        label="Zip/Postal Code"
        name="postcode"
        type="text"
      />
      <BaseInput
        v-model="address.region"
        v-if="!regions.length"
        label="State/Province"
        name="region"
        type="text"
      />
      <label>
        Select State/Province
      </label>
      <multiselect
        v-if="regions.length"
        v-model="regionWatcher"
        :options="regions"
        :allow-empty="false"
        :show-labels="false"
        track-by="value"
        label="label"
        placeholder="Select State/Province"
      />
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
    <div v-for="method in paymentMethods" :key="method.id">
      <input
        type="radio"
        v-model="selectedPaymentMethod"
        name="payment-method"
        :value="method"
        :id="method.code"
      />
      <label :for="method.code">
        {{ method.title }}
      </label>
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
    changeStep (newStep) {
      this.$store.commit('setStep', newStep)
    },
    placeOrder () {
      if (!this.billingAddress) {
        this.$store.commit('setAddress', {
          type: 'billing_address',
          address: this.address
        })
      }
      this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
    }
  },
  watch: {
    countryWatcher (newCountry) {
      this.address.country_id = newCountry.value;
      this.regionWatcher = '';
      this.onCountryChange();
    },
    regionWatcher (newRegion) {
      this.address.region_id = newRegion.value;
    }
  }
}
</script>
