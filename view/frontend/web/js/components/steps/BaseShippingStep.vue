<template>
  <section
    class="shipping-address"
    v-if="step === 'shipping'"
  >
    <h1>
      Shipping address
    </h1>

    <form @submit.prevent="setShippingInformation" class="shipping-address__form">
      <div class="shipping-address__field">
        <label for="email">
          Email:
        </label>
        <input
          v-model="email"
          type="email"
          id="email"
          name="email"
          class="input shipping-address__input"
        >
      </div>
      <div class="shipping-address__field">
        <label for="firstname">
          First Name:
        </label>
        <input
          v-model="firstname"
          type="text"
          id="firstname"
          name="firstname"
          class="input shipping-address__input"
        >
      </div>
      <div class="shipping-address__field">
        <label for="lastname">
          Lasr Name:
        </label>
        <input
          v-model="lastname"
          type="text"
          id="lastname"
          name="lastname"
          class="input shipping-address__input"
        >
      </div>
      <div class="shipping-address__field">
        <label for="telephone">
          Last Name:
        </label>
        <input
          v-model="telephone"
          type="tel"
          id="telephone"
          name="telephone"
          class="input shipping-address__input"
        >
      </div>
      <div class="shipping-address__field">
        <label for="street-first-row">
          Street Address:
        </label>
        <input
          v-model="streetFirstRow"
          type="text"
          id="street-first-row"
          name="street-first-row"
          class="input shipping-address__input"
        >
      </div>
      <div class="shipping-address__field">
        <label for="street-second-row">
          Street Address:
        </label>
        <input
          v-model="streetSecondRow"
          type="text"
          id="street-second-row"
          name="street-second-row"
          class="input shipping-address__input"
        >
      </div>
      <div class="fieldClass">
        <label for="country">Country</label>
        <select
          v-model="countryId"
          name="country"
          id="country"
          class="shipping-address__select"
          @change="onCountryChange"
        >
          <option v-for="country in countries" :key="country.value" :value="country.value">
            {{ country.label }}
          </option>
        </select>
      </div>
      <div class="shipping-address__field">
        <label for="city">
          City:
        </label>
        <input
          v-model="city"
          type="text"
          id="city"
          name="city"
          class="input shipping-address__input"
        >
      </div>
      <div class="shipping-address__field">
        <label for="postcode">
          Post Code:
        </label>
        <input
          v-model="postcode"
          type="text"
          id="postcode"
          name="postcode"
          class="input shipping-address__input"
        >
      </div>
      <div class="fieldClass">
        <label for="region-id">State/Province</label>
        <select
          v-model="regionId"
          name="region-id"
          id="region-id"
          class="shipping-address__select"
        >
          <option v-for="region in regions" :key="region.value" :value="region.value">
            {{ region.label }}
          </option>
        </select>
      </div>
      <div class="shipping-address__field">
        <label for="company">
          Company:
        </label>
        <input
          v-model="company"
          type="text"
          id="company"
          name="company"
          class="input shipping-address__input"
        >
      </div>
      <br>
      <BaseButton
        class="button"
        button-type="button"
        text="Next Step"
        @click.native="setShippingInformation"
      />
    </form>

    <h2>
      Shipping methods
    </h2>

    <BaseShippingMethods
      :options="shippingMethods"
      :currency-code="totals.base_currency_code"
      name="shipping"
      label-class="labels"
      container-class="methods__handler"
      field-class="radio methods__field"
      input-class="methods__radio"
    />

    <!-- <template v-for="field in shippingAddress">
      <template v-if="field.type !== 'select'">
        <BaseInput
          :key="field.id"
          :label="field.label"
          :name="field.name"
          :type="field.type"
          :value="field.value"
          field-class="shipping-address__field"
          input-class="input shipping-address__input"
        /> -->

      <!-- </template>

      <template v-if="field.type === 'select' && field.name !== 'region_id'">
        <BaseSelect
          :key="field.id"
          :label="field.label"
          :name="field.name"
          :options="field.options"
          field-class="shipping-address__field"
          select-class="shipping-address__select"
          @change.native="changeSelection"
        />
      </template>

      <template v-if="field.name === 'region_id'">
        <BaseSelect
          :key="field.id"
          :label="field.label"
          :name="field.name"
          :options="field.options"
          field-class="shipping-address__field"
          select-class="shipping-address__select"
          :class="{ 'region--hidden': isRegionIdHidden }"
          @change.native="changeSelection"
        />

        <BaseInput
          :key="field.id"
          label="State/Province"
          name="region"
          type="text"
          field-class="shipping-address__field"
          input-class="input shipping-address__input"
          :class="{ 'region--hidden': !isRegionIdHidden }"
        />

      </template>
    </template> -->
  </section>
</template>

<style lang="scss" scoped>
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
      isRegionIdHidden   : false,
      regionList         : regionList,
      shippingAddress    : shippingAddress,
      shippingInformation: this.$store.state.shippingInformation,
      totals             : this.$store.state.totals,
      email: '',
      firstname: '',
      lastname: '',
      telephone: '',
      streetFirstRow: '',
      streetSecondRow: '',
      countryId: '',
      city: '',
      postcode: '',
      regionId: '',
      company: '',
      countries,
      regions: []
    };
  },
  computed: {
    baseUrl() {
      return this.$store.state.baseUrl;
    },
    cartId() {
      return this.$store.getters.cartId;
    },
    step() {
      return this.$store.state.step;
    },
    shippingMethods() {
      return this.$store.state.shippingMethods;
    }
  },
  methods: {
    settingData(elements, object) {
      /**
       * Setting Data into fields in object from property
       * Need to replace in future
       *
      **/

      elements.forEach(element => {
        const id = element.id,
          value = element.value;

        if (element.tagName === 'INPUT' && value.length > 0) {
          if (id === 'street[0]') {
            object.street = [value];
          } else if (id === 'street[1]') {
            object.street.push(value);
          } else {
            object[id] = value;
          }
        } else if (id === 'region_id' && value.length > 0) {
          object[id] = parseInt(value);
          object['region'] = element.selectedOptions[0].innerHTML.trim();
        } else if (id === 'country_id' && value.length > 0) {
          object[id] = value;
        } else {
          return false;
        }
      });

      return object;
    },
    onCountryChange() {
      this.regions = this.$store.getters.regionsByCountryId(this.countryId);
      this.$store.dispatch('updateShippingMethods', this.countryId)
    },
    setShippingInformation() {
      console.log('setShippingInfo');
      // /**
      //  * Setting Shipping address and shipping method to object
      //  * Push data to store
      //  * Shipping Information set 1/2
      // **/

      // const object              = {},
      //       response            = this.shippingInformation.addressInformation,
      //       shippingAddressForm = this.$el.querySelector('.shipping-address__form')
      //                                 .querySelectorAll('input, select, textarea'),
      //       shippingMethod      = this.$el.querySelector('input[name="shipping"]:checked');

      // this.settingData(shippingAddressForm, response.shipping_address);

      // if (shippingMethod.value.length > 0) {
      //   response.shipping_carrier_code = shippingMethod.value;
      //   response.shipping_method_code = shippingMethod.dataset.methodCode;
      // } else {
      //   this.returnError();
      //   return false;
      // }

      // object.addressInformation = response;

      // this.$store.commit('updateShippingInformation', object);
      // this.getPaymentMethods();
    },
    getPaymentMethods() {
      /*
       * Getting payment methods by our shipping information which
       * we was setting before
       *
      **/

      // this.request(
      //   `${this.baseUrl}rest/V1/guest-carts/${this.cartId}/payment-methods`,
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // ).then(response => {
      //   this.$store.commit('updatePaymentMethods', response);
      //   this.$store.commit('updateStep', 'payment');
      // });
    }
  }
};
</script>
