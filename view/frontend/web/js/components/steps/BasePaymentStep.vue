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
      <template v-for="field in billingAddress">
        <template v-if="field.type !== 'select'">
          <BaseInput
            :key="field.id"
            :label="field.label"
            :name="field.name"
            :type="field.type"
            :value="field.value"
            field-class="billing-address__field"
            input-class="input billing-address__input"
          />
        </template>

        <template v-if="field.type === 'select' && field.name !== 'region_id'">
          <BaseSelect
            :key="field.id"
            :label="field.label"
            :name="field.name"
            :options="field.options"
            field-class="billing-address__field"
            select-class="billing-address__select"
            @change.native="changeSelection"
          />
        </template>

        <template v-if="field.name === 'region_id'">
          <BaseSelect
            :key="field.id"
            :label="field.label"
            :name="field.name"
            :options="field.options"
            field-class="billing-address__field"
            select-class="billing-address__select"
            :class="{ 'region--hidden': isRegionIdHidden }"
            @change.native="changeSelection"
          />

          <BaseInput
            :key="field.id"
            label="State/Province"
            name="region"
            type="text"
            field-class="billing-address__field"
            input-class="input billing-address__input"
            :class="{ 'region--hidden': !isRegionIdHidden }"
          />
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
      billingAddress        : {},
      config                : this.$store.state.config,
      isBillingAddressHidden: true,
      isRegionIdHidden      : false,
      regionList            : regionList,
      selectedPaymentMethod : null
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
    }
  },
  methods: {
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
    changeSelection(event) {
      /**
       * Method onchange select (country/region)
       * Returning country regions if exists
       *
      **/

      const getForm       = event.srcElement.parentElement.parentElement,
            countryId     = getForm.querySelector('#country_id'),
            eventSelectId = event.srcElement.id,
            inputRegion   = getForm.querySelector('#region'),
            regionId      = getForm.querySelector('#region_id');

      if (countryId == getForm.querySelector('#' + eventSelectId)) {
        const eventOptionValue = event.srcElement.selectedOptions[0].value,
              propertyRegions  = this.returnCountryRegions(this.regionList, eventOptionValue);

        inputRegion.value = '';

        if (propertyRegions.length > 1) {
          regionId.innerHTML = propertyRegions.join(' ');

          this.isRegionIdHidden = false;
        } else {
          this.isRegionIdHidden = true;
        }
      } else if (regionId == getForm.querySelector('#' + eventSelectId)) {
        const eventOptionCountryId = event.srcElement.selectedOptions[0].dataset.countryid,
              eventOptionValue     = event.srcElement.selectedOptions[0].value;

        if (!countryId.querySelector(`option[value="${eventOptionCountryId}"]`).selected) {
          const propertyRegions = this.returnCountryRegions(this.regionList, eventOptionCountryId);

          regionId.innerHTML = propertyRegions.join(' ');

          regionId.querySelector(`option[value="${eventOptionValue}"]`).selected = true;
          countryId.querySelector(`option[value="${eventOptionCountryId}"]`).selected = true;

          this.isRegionIdHidden = false;
        }
      }
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
        this.billingAddress = {};

        if (!this.isBillingAddressHidden) {
          this.isBillingAddressHidden = true;
        }
      } else {
        this.billingAddress = billingAddress;

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
      this.request(
        `${this.baseUrl}rest/V1/guest-carts/${this.cartId}/order`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "paymentMethod": {
              "method": this.selectedPaymentMethod.code
            }
          })
        }
      ).then(response => {
        this.$store.commit('updateStep', 'success');
      })
    }
  }
};
</script>
