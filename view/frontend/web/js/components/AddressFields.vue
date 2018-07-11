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
        v-validate="'required'"
        id="country"
        v-model="address.country_id"
        :options="countries"
        :allow-empty="false"
        :show-labels="false"
        data-vv-as="Country"
        name="country"
        label="label"
        placeholder="Select country"
        @input="onCountryChange"
      />
      <span
        v-show="errors.has('country')"
        class="input__message"
      >
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
      v-if="!regions.length"
      v-model="address.region"
      :validate-type="!regions.length ? 'required' : ''"
      label="State/Province"
      name="region"
      type="text"
    />
    <div
      v-if="regions.length"
      :class="{'input--error': errors.has('region_id') }"
    >
      <label for="region_id">
        Select State/Province
      </label>
      <multiselect
        v-validate="!regions.length ? '' : 'required'"
        id="region_id"
        v-model="address.region_id"
        :options="regions"
        :allow-empty="false"
        :show-labels="false"
        data-vv-as="Region"
        name="region_id"
        label="label"
        placeholder="Select State/Province"
      />

      <span
        v-show="errors.has('region_id')"
        class="input__message"
      >
        {{ errors.first('region_id') }}
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
  data () {
    return {
      address: {},
      countries
    }
  },
  computed: {
    addressData () {
      return this.$store.getters.addressByType(this.type)
    },
    regions () {
      if (this.address.country_id.value === null) {
        return []
      } else {
        return this.$store.getters.regionsByCountryId(this.address.country_id.value)
      }
    }
  },
  created () {
    this.address = this.addressData
    EventBus.$once('save-address', (type) => {
      this.$store.commit('setAddress', { type, address: this.address })
    })
  },
  methods: {
    onCountryChange () {
      if (this.type === 'shippingAddress') {
        this.$store.dispatch('updateShippingMethods', this.address.country_id.value)
      }
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
