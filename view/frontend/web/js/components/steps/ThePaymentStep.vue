<template>
  <section
    v-if="step === 'payment'"
    class="billing-address"
  >
    <h2>
      Billing Address
    </h2>
    <BaseCheckbox
      id="billing-address-same-as-shipping-address"
      v-model="billingAndShippingAddressTheSame"
      label-class="label"
      field-class="checkbox shipping-address__field"
      input-class="shipping-address__checkbox"
      name="billing-address-same-as-shipping-address"
      text="My billing and shipping address are the same"
    />
    <div v-if="billingAndShippingAddressTheSame">
      <p>
        {{ billingAddress.firstname }} {{ billingAddress.lastname }}
      </p>
      <p>
        {{ billingAddress.telephone }}
      </p>
      <p>
        {{ billingAddress.street[0] }} {{ billingAddress.street[1] }}
      </p>
      <p>
        {{ billingAddress.city }}
      </p>
      <p>
        {{ billingAddress.postcode }}
      </p>
      <p>
        {{ billingAddress.company }}
      </p>
    </div>
    <form
      v-else
      class="billing-address__form"
    >
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
            data-vv-as="Region"
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
        <BaseButton
          text="SaveAddress"
          @click.native="saveAddress"
        />
        <BaseButton
          text="Cancel"
          @click.native="toggleBillingAddress"
        />
      </div>
    </form>
    <h2>
      Payment methods
    </h2>
    <div
      v-for="method in paymentMethods"
      :key="method.id"
    >
      <input
        v-model="selectedPaymentMethod"
        :value="method"
        :id="method.code"
        type="radio"
        name="payment-method"
      >
      <label :for="method.code">
        {{ method.title }}
      </label>
    </div>
    <DiscountCodeForm/>
    <BaseButton
      :loader="loader"
      text="Place order"
      @click.native="placeOrder"
    />
    <BaseButton
      text="Back"
      @click.native="changeStep('shipping')"
    />
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue'
import BaseCheckbox from '../BaseCheckbox.vue'
import BaseInput from '../BaseInput.vue'
import DiscountCodeForm from '../DiscountCodeForm.vue'
import { required, requiredIf } from 'vuelidate/lib/validators'
import countries from '../../data/countries.json'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
    DiscountCodeForm,
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
      selectedPaymentMethod: null,
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
    cartId () {
      return this.$store.getters.cartId
    },
    step () {
      return this.$store.state.step
    },
    regions () {
      if (this.address.country_id.value === null) {
        return []
      } else {
        return this.$store.getters.regionsByCountryId(this.address.country_id.value)
      }
    },
    billingAddress () {
      return this.$store.state.billingAddress
    },
    paymentMethods () {
      return this.$store.state.paymentMethods
    }
  },
  methods: {
    toggleBillingAddress () {
      this.billingAndShippingAddressTheSame = !this.billingAndShippingAddressTheSame
    },
    saveAddress () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$store.commit(
          'setAddress',
          { type: 'billingAddress', address: this.address }
        )
        this.toggleBillingAddress()
      }
    },
    changeStep (step) {
      this.$store.commit('setItem', { item: 'step', value: step })
    },
    placeOrder () {
      if (!this.billingAddress) {
        this.loader = true
        this.$store.dispatch('getTotals')
        this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
          .then(() => {
            this.loader = false
          })
      } else {
        // this.$validator.validate('payment-method').then((result) => {
        //   if (result) {
        this.loader = true
        this.$store.dispatch('placeOrder', this.selectedPaymentMethod)
          .then(() => {
            this.loader = false
          })
        // }
        // })
        //   .catch(() => {
        //     console.error('Error with finalize your order - please try again later')
        //   })
      }
    }
  }
}
</script>
