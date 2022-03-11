<template>
  <BaseInput
    id="firstname"
    v-model="v$.address.firstname.$model"
    :validation="v$.address.firstname"
    label="First name"
  />
  <BaseInput
    id="lastname"
    v-model="v$.address.lastname.$model"
    :validation="v$.address.lastname"
    label="Last name"
  />
  <BaseInput
    id="telephone"
    v-model="v$.address.telephone.$model"
    :validation="v$.address.telephone"
    label="Phone Number"
    type="tel"
  />
  <BaseInput
    id="street0"
    v-model="v$.address.street0.$model"
    :validation="v$.address.street0"
    label="Street Address"
  />
  <BaseInput
    id="street1"
    v-model="address.street1"
    label="Street Address"
  />
  <BaseSelect
    id="country"
    v-model="v$.address.country_id.$model"
    :validation="v$.address.country_id"
    :options="countries"
    label="Country"
  />
  <BaseInput
    id="city"
    v-model="v$.address.city.$model"
    :validation="v$.address.city"
    label="City"
  />
  <BaseInput
    id="postcode"
    v-model="v$.address.postcode.$model"
    :validation="v$.address.postcode"
    label="Zip/Postal Code"
  />
  <BaseSelect
    v-if="regions.length"
    id="region-id"
    v-model="v$.address.region_id.$model"
    :validation="v$.address.region_id"
    :options="regions"
    label="State/Provinc"
  />
  <BaseInput
    v-else
    id="region"
    v-model="v$.address.region.$model"
    :validation="v$.address.region"
    label="State/Province"
  />
  <BaseInput
    id="company"
    v-model="address.company"
    label="Company"
  />
</template>

<script>
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'

import useVuelidate from '@vuelidate/core'
import { required, requiredIf } from '@vuelidate/validators'
import countries from './../data/countries.json'

import { mapState, mapActions } from 'pinia'
import { useStore } from '@/store/index.js'

export default {
  emits: ['valid'],
  setup () {
    return { v$: useVuelidate() }
  },
  components: {
    BaseInput,
    BaseSelect
  },
  data() {
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
      countries
    }
  },
  validations: {
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
    ...mapState(useStore, ['getAddressByType', 'getRegionsByCountryId']),
    regions() {
      return this.getRegionsByCountryId(this.address.country_id)
    },
    addressData() {
      return this.getAddressByType('shippingAddress')
    }
  },
  watch: {
    'address.country_id'() {
      this.updateShippingMethods(this.address.country_id)
    },
    address: {
      handler() {
        if (!this.v$.address?.$invalid) {
          useStore().shippingAddress = this.address
        }
      },
      deep: true
    }
  },
  created() {
    if (this.addressData !== null) {
      this.address = this.addressData
    }
  },
  methods: {
    ...mapActions(useStore, ['updateShippingMethods'])
  }
}
</script>

<style>
.input--error.input__message {
  display: block;
  color: red;
}

input[type="text"].multiselect__input {
  height: auto;
  border: none;
}
</style>
