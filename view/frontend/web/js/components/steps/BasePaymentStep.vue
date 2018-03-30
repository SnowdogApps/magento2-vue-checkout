<template>
  <section
    class="billing-address"
    v-if="step === 'payment'"
  >
    <h1>
      Review & Payments Step
    </h1>
    <hr>
    <h2>
      Billing Address
    </h2>

    <BaseCheckbox
      id="billing-address"
      label-class="label"
      field-class="checkbox shipping-address__field"
      input-class="shipping-address__checkbox"
      checked="true"
      name="shippingAddress"
      text="My billing and shipping address are the same"
      @change.native="toggleBillingAddress"
    />

    <form
      class="billing-address__form"
      :class="{ 'billing-address--hidden': isBillingAddressHidden }"
    >
      <template v-for="field in address">
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

      <BaseButton
        class="button"
        button-type="button"
        text="Cancel"
        @click.native="cancelBillingInformations"
      />
    </form>

    <h2>
      Payment methods
    </h2>

    <div
        v-for="method in paymentMethods"
        :key="method.id"
      >
        <input
          type="radio"
          v-model="selectedPaymentMethod"
          name="payment-method"
          :value="method"
          :id="method.code"
        />

        <label :for="method.code">
          {{ method.title }}
        </label>
      </div>

    <BaseButton
      class="button"
      button-type="button"
      text="Place order"
      @click.native="placeOrder"
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
import BaseSelect from '../BaseSelect.vue';
import countries from '../../data/countries.json';

export default {
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
    BaseSelect
  },
  data() {
    return {
      baseUrl               : baseUrl,
      address               : address,
      config                : this.$store.state.config,
      isBillingAddressHidden: true,
      isRegionIdHidden      : false,
      regionList            : regionList,
      selectedPaymentMethod : null,
      countries,
      regions: []
    };
  },
  computed: {
    cartId() {
      return this.$store.getters.cartId;
    },
    step() {
      return this.$store.state.step;
    },
    paymentMethods () {
      return this.$store.state.paymentMethods;
    },
    shippingInformation () {
      return this.$store.state.shippingInformation;
    },
    currencyCode () {
      return this.$store.getters.currencyCode
    },
    billingAddress () {
      return this.$store.getters.billingAddress
    }
  },
  methods: {
    onCountryChange(selectedOption) {
      this.countryId = selectedOption
      this.regions = this.$store.getters.regionsByCountryId(this.countryId);
    },
    onRegionChange(selectedOption) {
      this.regionId = selectedOption
    },
    changeStep(newStep) {
      this.$store.commit('updateStep', newStep);
    },
    parseJSON(response) {
      return new Promise(resolve =>
        response.json().then(json =>
          resolve({
            status: response.status,
            ok: response.ok,
            json
          })
        )
      );
    },
    request(url, params = {}) {
      return new Promise((resolve, reject) => {
        fetch(url, params)
          .then(this.parseJSON)
          .then(response => {
            if (response.ok) {
              return resolve(response.json);
            }
            // extract the error from the server's json
            return reject(response.json);
          })
          .catch(error =>
            reject({
              networkError: error.message
            })
          );
      });
    },
    returnCountryRegions(regions, optionToCompare) {
      /**
       * Rendering country region list
       * Return in array and passing to select
       * Need to replace in future
       *
      **/

      let newRegionList = [];

      newRegionList.push(`
        <option value="">
          <?= /* @escapeNotVerified */ __('Please select a region, state or province.'); ?>
        </option>
      `);

      regions.forEach(region => {
        if (region.country_id === optionToCompare) {
          newRegionList.push(`
            <option value="${region.value}" data-countryid="${region.country_id}">
              ${region.label}
            </option>
          `);
        }
      });

      return newRegionList;
    },
    toggleBillingAddress(event) {
      /**
       * Showing/Hidding Billing Address by checkbox
       *
      **/

      const element = event.srcElement;

      if (element.checked) {
        this.address = {};

        if (!this.isBillingAddressHidden) {
          this.isBillingAddressHidden = true;
        }
      } else {
        this.address = billingAddress;

        if (this.isBillingAddressHidden) {
          this.isBillingAddressHidden = false;
        }
      }
    },
    cancelBillingInformations() {
      /**
       * Cancel addin a Billing Address
       * Hidding it
       *
      **/
      const billingCheckbox = this.$el.querySelector('#billing-address');


      this.billingAddress = {};
      this.isBillingAddressHidden = true;
      billingCheckbox.checked = true;
    },
    placeOrder() {
      this.$store.commit('setAddress', {
        type: 'billing',
        address: this.address
      });
      this.request(
        `${this.baseUrl}rest/V1/guest-carts/${this.cartId}/payment-information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "billingAddress": this.billingAddress,
            "email": "test@gmail.com",
            "paymentMethod": {
              "method": this.selectedPaymentMethod.code
            }
          })
        }
      ).then(response => {
        //TODO: Show order Id on success page
        console.log("Order id: " + response);
        this.$store.commit('updateStep', 'success');
      })
    }
  }
};
</script>
