<template>
  <section
    class="methods"
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
      :class="{ 'shipping-address--hidden': isBillingAddressHidden }"
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
      config                : this.$store.state.config,
      billingAddress        : {},
      paymentMethods        : this.$store.state.paymentMethods,
      selectedMethods       : this.$store.state.selectedMethods,
      regionList            : regionList,
      isBillingAddressHidden: true
    };
  },
  computed: {
    cartId() {
      return this.$store.state.cart;
    },
    step() {
      return this.$store.state.step;
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
      });
    },
    setMethods() {
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
      const object                  = {},
            response                = this.shippingInformation.addressInformation,
            billingAddressCheckbox  = this.$el.getElementById('billingAddress'),
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
      const returnObj      = this.selectedMethods,
            shippngMethod  = this.shippingInformation.addressInformation,
            paymentMethod  = this.$el.querySelector('input[name="payment"]:checked');

      returnObj.shippingCarrierCode = shippingMethod.shipping_carrier_code;
      returnObj.shippingMethodCode = shippingMethod.shipping_method_code;

      if (paymentMethod.value.length > 0) {
        returnObj.paymentMethod.method = paymentMethod.value;
      } else {
        this.returnError();
        return false;
      }

      return returnObj;
    },
    settingData(elements, object) {
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
      const billingCheckbox = this.$el.getElementById('billingAddress');

      this.billingAddress = {};
      this.isBillingAddressHidden = true;
      billingCheckbox.checked = true;
    }
  }
};
</script>
