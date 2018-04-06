<template>
  <section class="shipping-address" v-if="step === 'shipping'">
    <h1>
      Shipping Step
    </h1>
    <hr>
    <h2>
      Shipping address
    </h2>

    <form @submit.prevent="onFormSubmit" class="shipping-address__form">
      <BaseInput
        v-model="address.email"
        label="Email"
        name="email"
        type="email"
      />
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
      <BaseSelect
        v-model="address.country_id"
        label="Country"
        name="country_id"
        :options="countries"
        @input="onCountryChange"
      >
        <option slot="default-option" value="null">
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
      <BaseSelect
        v-model="address.region_id"
        v-if="regions.length"
        label="State/Province"
        name="region_id"
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

      <h2>
        Shipping methods
      </h2>

      <template v-if="shippingMethods.length > 0">
        <div
          v-for="method in shippingMethods"
          v-if="method.available"
          :key="method.id"
        >
          <input
            type="radio"
            v-model="selectedShippingMethod"
            name="shipping-method"
            :value="method"
            :id="method.carrier_code"
          />

          <label
            :for="method.carrier_code"
          >
            <span class="label__text">
              {{ method.carrier_title }} - {{ method.method_title }}
            </span>

            <span class="label__price">
                {{ method.price_incl_tax | currency(currencyCode) }}
            </span>
          </label>
        </div>
      </template>
      <template v-else>
        <p>
          In this country we don't handle any shipping methods.
        </p>
      </template>

      <BaseButton
        class="button"
        button-type="submit"
        text="Next Step"
      />
    </form>
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue';
import BaseCheckbox from '../BaseCheckbox.vue';
import BaseInput from '../BaseInput.vue';
import BaseSelect from '../BaseSelect.vue';
import BaseShippingMethods from '../BaseShippingMethods.vue';
import countries from '../../data/countries.json';

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    BaseShippingMethods
  },
  data() {
    return {
      address: {
        email: '',
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
      shippingAddress: address,
      countries,
      regions: [],
      selectedShippingMethod: null
    };
  },
  computed: {
    step() {
      return this.$store.state.step;
    },
    shippingMethods() {
      return this.$store.state.shippingMethods;
    },
    currencyCode () {
      return this.$store.getters.currencyCode
    }
  },
  methods: {
    onCountryChange(selectedOption) {
      this.regions = this.$store.getters.regionsByCountryId(this.address.country_id);
      this.$store.dispatch('updateShippingMethods', this.address.country_id)
    },
    onFormSubmit() {
      this.$store.commit('setAddress', {
        type: 'shipping_address',
        address: this.address
      });
      this.$store.commit('setShippinInformation', this.selectedShippingMethod);
      this.$store.dispatch('setShippinInformation');
    }
  }
};
</script>
