<template>
  <section class="shipping-address" v-if="step === 'shipping'">
    <h1>
      Shipping address
    </h1>

    <form @submit.prevent="onFormSubmit" class="shipping-address__form">
      <template v-for="field in shippingAddress">
        <template v-if="field.type !== 'select'">
          <BaseInput
            v-model="field.value"
            :key="field.id"
            :label="field.label"
            :name="field.name"
            :type="field.type"
          />
        </template>

        <template
          v-else-if="
            field.type === 'select'
            && field.name === 'country_id'
          "
        >
          <BaseSelect
            v-model="field.value"
            :key="field.id"
            :label="field.label"
            :name="field.name"
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
        </template>

        <template
          v-else-if="
            field.type === 'select'
            && field.name === 'region_id'
          "
        >
          <BaseSelect
            v-model="field.value"
            :key="field.id"
            :label="field.label"
            :name="field.name"
            :options="regions"
            @input="onRegionChange"
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
        </template>
      </template>

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
            v-model="shippingMethod"
            name="shipping-method"
            :value="method.carrier_code"
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
      shippingAddress: shippingAddress,
      countries,
      regions: [],
      countryId: '',
      regionId: '',
      shippingMethod: ''
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
      this.countryId = selectedOption
      this.regions = this.$store.getters.regionsByCountryId(this.countryId);
      this.$store.dispatch('updateShippingMethods', this.countryId)
    },
    onRegionChange(selectedOption) {
      this.regionId = selectedOption
    },
    onFormSubmit() {
      // TODO: save form data to store
      this.$store.dispatch('getPaymentMethods')
    }
  }
};
</script>

<style lang="scss" scoped>
.region {
  &--hidden {
    display: none;
  }
}
</style>
