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
    <BaseSelect
      v-model="address.country_id"
      label="Country"
      name="country_id"
      :options="countries"
      validate-type="required"
      @input="onCountryChange"
    >
      <option slot="default-option" value="">
        Select country
      </option>
      <template slot-scope="option">
        <option :value="option.value">
          {{ option.label }}
        </option>
      </template>
    </BaseSelect>
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
    <BaseSelect
      v-model="address.region_id"
      v-if="regions.length"
      label="State/Province"
      name="region_id"
      :validate-type="!regions.length ? '' : 'required'"
      :options="regions"
    >
      <option slot="default-option" value="">
        Select State/Province
      </option>
      <template slot-scope="option">
        <option :value="option.value">
          {{ option.label }}
        </option>
      </template>
    </BaseSelect>
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
import BaseSelect from './BaseSelect.vue'
import countries from '../data/countries.json'
import EventBus from '../event-bus'

export default {
  inject: ['$validator'],
  data () {
    return {
      address: {},
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
    BaseSelect
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
  }
}
</script>
