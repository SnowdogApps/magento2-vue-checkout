<template>
  <div>
    <BaseInput
      v-model="$v.address.firstname.$model"
      :validation="$v.address.firstname"
      :label="$t('First Name')"
      name="firstname"
    />
    <BaseInput
      v-model="$v.address.lastname.$model"
      :validation="$v.address.lastname"
      :label="$t('Last Name')"
      name="lastname"
    />
    <BaseInput
      v-model="$v.address.telephone.$model"
      :validation="$v.address.telephone"
      :label="$t('Phone Number')"
      name="telephone"
      type="tel"
    />
    <BaseInput
      v-model="$v.address.street0.$model"
      :validation="$v.address.street0"
      :label="$t('Street Address')"
      name="street0"
    />
    <BaseInput
      v-model="address.street1"
      :label="$t('Street Address')"
      name="street1"
    />
    <div>
      <label for="country">
        {{ $t('Select Country') }}
      </label>
      <multiselect
        id="country"
        v-model="$v.address.country_id.$model"
        :options="countries"
        :allow-empty="false"
        :show-labels="false"
        :placeholder="$t('Select Country')"
        name="country"
        label="label"
        @input="onCountryChange"
      />
      <span
        v-if="
          $v.address.country_id.$error
            && !$v.address.country_id.required
        "
      >
        {{ $t('This field is required!') }}
      </span>
    </div>
    <BaseInput
      v-model="$v.address.city.$model"
      :validation="$v.address.city"
      :label="$t('City')"
      name="city"
    />
    <BaseInput
      v-model="$v.address.postcode.$model"
      :validation="$v.address.postcode"
      :label="$t('Zip Code')"
      name="postcode"
    />
    <BaseInput
      v-if="!regions.length"
      v-model="$v.address.region.$model"
      :validation="$v.address.region"
      :label="$t('State')"
      name="region"
    />
    <div v-if="regions.length">
      <label for="region_id">
        {{ $t("Select State") }}
      </label>
      <multiselect
        id="region_id"
        v-model="$v.address.region_id.$model"
        :validation="$v.address.region_id"
        :options="regions"
        :allow-empty="false"
        :show-labels="false"
        :placeholder="$t('Select State')"
        name="region_id"
        label="label"
      />
      <span
        v-if="
          $v.address.region_id.$error
            && !$v.address.region_id.required
        "
      >
        {{ $t('This field is required!') }}
      </span>
    </div>
    <BaseInput
      v-model="address.company"
      :label="$t('Company')"
      name="company"
    />
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import Multiselect from 'vue-multiselect'
import { required, requiredIf } from 'vuelidate/lib/validators'
import countries from './../data/countries.json'

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
    regions () {
      return this.$store.getters.regionsByCountryId(this.address.country_id.value)
    },
    ready () {
      return !this.$v.address.$invalid
    },
    addressData () {
      if (this.$store.state.shippingAddress !== null) {
        return this.$store.getters.addressByType('shippingAddress')
      } else {
        return null
      }
    }
  },
  watch: {
    ready (val) {
      this.$emit('ready', val)
    },
    address: {
      handler () {
        if (this.ready) {
          this.$store.commit(
            'setAddress',
            { type: 'shippingAddress', address: this.address }
          )
        }
      },
      deep: true
    }
  },
  created () {
    if (this.addressData !== null) {
      this.address = this.addressData
    }
  },
  methods: {
    touch () {
      this.$v.address.$touch()
    },
    onCountryChange () {
      this.$store.dispatch(
        'updateShippingMethods',
        this.address.country_id.value
      )
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
