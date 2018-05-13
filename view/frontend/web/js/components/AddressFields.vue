<template>
  <div>
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
  </div>
</template>

<script>
import BaseInput from './BaseInput.vue'
import countries from '../data/countries.json'
import Multiselect from 'vue-multiselect'
import EventBus from '../event-bus'

export default {
  inject: ['$validator'],
  data () {
    return {
      address: {},
      countryWatcher: '',
      regionWatcher: '',
      countries,
      regions: []
    }
  },
  computed: {
    addressData () {
      return this.$store.getters.addressByType(this.type)
    }
  },
  components: {
    BaseInput,
    Multiselect
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    onCountryChange (selectedOption) {
      this.regions = this.$store.getters.regionsByCountryId(this.address.country_id)
      if (this.type === 'shipping_address') {
        this.$store.dispatch('updateShippingMethods', this.address.country_id)
      }
    }
  },
  created () {
    this.address = this.addressData
    EventBus.$once('save-address', (type) => {
      this.$store.commit('setAddress', { type, address: this.address })
    })
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
