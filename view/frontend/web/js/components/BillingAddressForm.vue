<template>
  <form>
    <BaseInput
      v-model="$v.address.firstname.$model"
      :validation="$v.address.firstname"
      :label="$t('formElements.firstName')"
      name="firstname"
    />
    <BaseInput
      v-model="$v.address.lastname.$model"
      :validation="$v.address.lastname"
      :label="$t('formElements.lastName')"
      name="lastname"
    />
    <BaseInput
      v-model="$v.address.telephone.$model"
      :validation="$v.address.telephone"
      :label="$t('formElements.phoneNumber')"
      name="telephone"
      type="tel"
    />
    <BaseInput
      v-model="$v.address.street0.$model"
      :validation="$v.address.street0"
      :label="$t('formElements.streetAddress')"
      name="street0"
    />
    <BaseInput
      v-model="address.street1"
      :label="$t('formElements.streetAddress')"
      name="street1"
    />
    <div>
      <label for="country">
        {{ $t('formElements.country') }}
      </label>
      <multiselect
        id="country"
        v-model="$v.address.country_id.$model"
        :options="countries"
        :allow-empty="false"
        :show-labels="false"
        :placeholder="$t('formElements.country')"
        name="country"
        label="label"
      />
      <span
        v-if="
          $v.address.country_id.$error
            && !$v.address.country_id.required
        "
      >
        {{ $t('errorCode.required') }}
      </span>
    </div>
    <BaseInput
      v-model="$v.address.city.$model"
      :validation="$v.address.city"
      :label="$t('formElements.city')"
      name="city"
    />
    <BaseInput
      v-model="$v.address.postcode.$model"
      :validation="$v.address.postcode"
      :label="$t('formElements.zipCode')"
      name="postcode"
    />
    <BaseInput
      v-if="!regions.length"
      v-model="$v.address.region.$model"
      :validation="$v.address.region"
      :label="$t('formElements.state')"
      name="region"
    />
    <div v-if="regions.length">
      <label for="region_id">
        {{ $t('formElements.selectState') }}
      </label>
      <multiselect
        id="region_id"
        v-model="$v.address.region_id.$model"
        :validation="$v.address.region_id"
        :options="regions"
        :allow-empty="false"
        :show-labels="false"
        :placeholder="$t('formElements.state')"
        name="region_id"
        label="label"
      />
      <span
        v-if="
          $v.address.region_id.$error
            && !$v.address.region_id.required
        "
      >
        {{ $t('errorCode.required') }}
      </span>
    </div>
    <BaseInput
      v-model="address.company"
      :label="$t('formElements.company')"
      name="company"
    />
    <BaseButton
      :text="$t('general.saveAddress')"
      @click.native="saveAddress"
    />
  </form>
</template>

<script>
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import { required, requiredIf } from 'vuelidate/lib/validators'
import countries from '../data/countries.json'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    BaseButton,
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
        region: '',
        region_id: '',
        company: ''
      },
      countries,
      billingAndShippingAddressTheSame: true,
      editBillingAddress: true,
      selectedPaymentMethod: null,
      paymentMethodsReadyToSubmit: false,
      loader: false
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
    newBillingAddress () {
      if (this.$store.state.newBillingAddress !== null) {
        return this.$store.getters.addressByType('newBillingAddress')
      } else {
        return null
      }
    },
    regions () {
      return this.$store.getters.regionsByCountryId(this.address.country_id.value)
    }
  },
  created () {
    if (this.newBillingAddress !== null) {
      this.address = this.newBillingAddress
    }
  },
  methods: {
    saveAddress () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$emit('hideAddressForm')
        this.$store.commit(
          'setAddress',
          { type: 'newBillingAddress', address: this.address }
        )
      }
    }
  }
}
</script>
