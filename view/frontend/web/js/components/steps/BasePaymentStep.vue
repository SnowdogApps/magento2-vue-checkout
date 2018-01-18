<template>
  <section
    class="billing-address"
    v-if="step === 'payment'"
  >
    <h1>
      Billing Address
    </h1>

    <BaseCheckbox
      id="billing-address"
      label-class="label"
      field-class="checkbox shipping-address__field"
      input-class="shipping-address__checkbox"
      checked="true"
      text="My billing and shipping address are the same"
    />

    <form class="shipping-address__form">
      <template v-for="field in billingAddress">
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
    </form>

    <h2>
      Payment methods
    </h2>

    <BasePaymentMethods
      :options="paymentMethods"
      name="payment"
      label-class="labels"
      container-class="methods__handler"
      field-class="radio methods__field"
      input-class="methods__radio"
    />

    <BaseButton
      class="button"
      button-type="button"
      text="Go to summary"
      @click.native="setShippingInformation"
    />

    <BaseButton
      class="button"
      button-type="button"
      text="Back"
      @click.native="changeStep('shipping')"
    />
  </section>
</template>

<style lang="scss" scoped>
.billing-address {
  &--hidden {
    display: none;
  }
}

.region {
  &--hidden {
    display: none;
  }
}
</style>

<script>
import BaseButton from '../BaseButton.vue';
import BaseCheckbox from '../BaseCheckbox.vue';
import BaseInput from '../BaseInput.vue';
import BasePaymentMethods from '../BasePaymentMethods.vue';
import BaseSelect from '../BaseSelect.vue';

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
    BasePaymentMethods,
    BaseSelect
  },
  data() {
    return {
      baseUrl               : baseUrl,
      billingAddress        : billingAddress,
      config                : this.$store.state.config,
      isBillingAddressHidden: true,
      isRegionIdHidden      : false,
      regionList            : regionList,
      selectedMethods       : this.$store.state.selectedMethods
    };
  },
  computed: {
    cartId() {
      return this.$store.getters.cartId;
    },
    step() {
      return this.$store.state.step;
    },
    paymentMethods() {
      return this.$store.state.paymentMethods;
    },
    shippingInformation() {
      return this.$store.state.shippingInformation;
    }
  },
  methods: {
    changeStep(newStep) {
      this.$store.commit('updateStep', newStep);
    },
    toggleBillingAddress(event) {

    }
  }
};
</script>
