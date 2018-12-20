<template>
  <section
    v-if="step === 'shipping'"
    class="shipping-address"
  >
    <h2>Shipping address</h2>
    <form class="shipping-address__form">
      <CustomerEmailField
        v-if="!isCustomerLoggedIn"
        ref="customerEmail"
        @ready="isReady => customerEmailReadyToSubmit = isReady"
      />
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
          <span
            v-if="
              $v.address.country_id.$error
                && !$v.address.country_id.required
            "
          >
            This field is required!
          </span>
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
          <span
            v-if="
              $v.address.region_id.$error
                && !$v.address.region_id.required
            "
          >
            This field is required!
          </span>
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
import CustomerEmailField from '../CustomerEmailField.vue'
import ShippingMethods from '../ShippingMethods.vue'
import Multiselect from 'vue-multiselect'
import countries from '../../data/countries.json'
import { required, requiredIf } from 'vuelidate/lib/validators'

export default {
  components: {
    BaseButton,
    BaseInput,
    CustomerEmailField,
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
      countries,
      customerEmailReadyToSubmit: false,
      shippingMethodsReadyToSubmit: false,
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
    step () {
      return this.$store.state.step
    },
    isCustomerLoggedIn () {
      return this.$store.getters.isCustomerLoggedIn
    },
    regions () {
      return this.$store.getters.regionsByCountryId(this.address.country_id.value)
    }
  },
  methods: {
    onCountryChange () {
      this.$store.dispatch('updateShippingMethods', this.address.country_id.value)
    },
    goToNextStep () {
      if (!this.isCustomerLoggedIn) {
        this.$refs.customerEmail.touch()
      }

      this.$refs.shippingsMethods.touch()
      this.$v.$touch()

      if (
        this.$v.$invalid ||
        !this.shippingMethodsReadyToSubmit ||
        (!this.isCustomerLoggedIn && !this.customerEmailReadyToSubmit)
      ) {
        return
      }

      this.loader = true

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
