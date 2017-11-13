<template>
  <section
    class="billing-address"
    v-if="step === 'payment'"
  >
    <h1>
      Billing Address
    </h1>

    <BaseCheckbox
      id="billingAddress"
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
      billingAddress        : {},
      config                : this.$store.state.config,
      isBillingAddressHidden: true,
      isRegionIdHidden      : false,
      regionList            : regionList,
      selectedMethods       : this.$store.state.selectedMethods
    };
  },
  computed: {
    cartId() {
      return this.$store.state.cart;
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
    setShippingInformation() {
      /**
       * Setting Payment Address
       * Push address to data
       * Shipping Information 2/2
       *
      **/

      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/shipping-information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.getShippingInformation())
        }
      ).then(response => {
        this.setMethods();
        // Update step to summary is in setMethods method
      });
    },
    setMethods() {
      /**
       * Return totals informations and push to store
       *
      **/

      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/collect-totals`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.getSelectedMethods())
        }
      ).then(response => {
        this.$store.commit('updateTotals', response);
        this.$store.commit('updateStep', 'summary');
      });
    },
    getShippingInformation() {
      /**
       * Method which returnning Billing Address
       * Update it in store
       *
      **/

      const object                  = {},
            response                = this.shippingInformation.addressInformation,
            billingAddressCheckbox  = this.$el.querySelector('#billingAddress'),
            billingAddressForm      = this.$el.querySelector('.billing-address__form')
                                          .querySelectorAll('input, select, textarea');

      if (billingAddressCheckbox.checked) {
        response.billing_address = response.shipping_address;
        response.shipping_address['same_as_billing'] = 1;
      } else {
        this.settingData(billingAddressForm, response.billing_address);
      }

      object.addressInformation = response;
      this.$store.commit('updateShippingInformation', object);

      return object;
    },
    getSelectedMethods() {
      /**
       * Getting data with selected methods
       * Setting it into object
      **/

      const returnObj      = this.selectedMethods,
            shippingMethod = this.shippingInformation.addressInformation,
            paymentMethod  = this.$el.querySelector('input[name="payment"]:checked');

      returnObj.shippingCarrierCode = shippingMethod.shipping_carrier_code;
      returnObj.shippingMethodCode = shippingMethod.shipping_method_code;

      if (paymentMethod.value.length > 0) {
        returnObj.paymentMethod.method = paymentMethod.value;
      } else {
        this.returnError();
        return false;
      }

      this.$store.commit('updateSelectedMethods', returnObj);

      return returnObj;
    },
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
          this.returnError();
          return false;
        }
      });

      return object;
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
      const billingCheckbox = this.$el.querySelector('#billingAddress');


      this.billingAddress = {};
      this.isBillingAddressHidden = true;
      billingCheckbox.checked = true;
    }
  }
};
</script>
