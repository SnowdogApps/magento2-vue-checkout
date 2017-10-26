<template>
  <section class="shipping-information" v-if="step === 'addresses'">
    <h1>
      Billing Address
    </h1>

    <form class="billing-address__form">
      <template v-for="field in billingAddress">
        <template v-if="field.type !== 'select'">
          <BaseInput
            :label="field.label"
            :name="field.name"
            :type="field.type"
            :value="field.value"
            fieldclass="billing-address__field"
            inputclass="input billing-address__input"
          />
        </template>

        <template v-if="field.type === 'select' && field.name !== 'region_id'">
          <BaseSelect
            :label="field.label"
            :name="field.name"
            :options="field.options"
            fieldclass="billing-address__field"
            selectclass="billing-address__select"
            @change.native="changeSelection"
          />
        </template>

        <template v-if="field.name === 'region_id'">
          <BaseSelect
            :label="field.label"
            :name="field.name"
            :options="field.options"
            fieldclass="billing-address__field"
            :class="{ 'region--hidden': isRegionIdHidden }"
            selectclass="billing-address__select"
            @change.native="changeSelection"
          />

          <BaseInput
            label="State/Province"
            name="region"
            type="text"
            fieldclass="billing-address__field"
            :class="{ 'region--hidden': !isRegionIdHidden }"
            inputclass="input billing-address__input"
          />
        </template>
      </template>
    </form>

    <h1>
      Shipping address
    </h1>

    <BaseCheckbox
      id="shippingAddress"
      labelclass="label"
      fieldclass="checkbox shipping-address__field"
      inputclass="shipping-address__checkbox"
      checked="true"
      name="shippingAddress"
      text="My billing and shipping address are the same"
      @change.native="toggleShippingAddress"
    />

    <form class="shipping-address__form"
          :class="{ 'shipping-address--hidden': isShippingAddressHidden }"
    >
      <template v-for="field in shippingAddress">
        <template v-if="field.type !== 'select'">
          <BaseInput
            :label="field.label"
            :name="field.name"
            :type="field.type"
            :value="field.value"
            fieldclass="shipping-address__field"
            inputclass="input shipping-address__input"
          />
        </template>

        <template v-if="field.type === 'select' && field.name !== 'region_id'">
            <BaseSelect
              :label="field.label"
              :name="field.name"
              :options="field.options"
              fieldclass="shipping-address__field"
              selectclass="shipping-address__select"
              @change.native="changeSelection"
            />
        </template>

        <template v-if="field.name === 'region_id'">
          <BaseSelect
            :label="field.label"
            :name="field.name"
            :options="field.options"
            fieldclass="billing-address__field"
            :class="{ 'region--hidden': isRegionIdHidden }"
            selectclass="billing-address__select"
            @change.native="changeSelection"
          />

          <BaseInput
            label="State/Province"
            name="region"
            type="text"
            fieldclass="shipping-address__field"
            :class="{ 'region--hidden': !isRegionIdHidden }"
            inputclass="input shipping-address__input"
          />
        </template>
      </template>

      <BaseButton
        class="button"
        buttontype="button"
        text="Cancel"
        @click.native="cancelShippingInformations"
      />
    </form>

    <BaseButton
      class="button"
      buttontype="button"
      text="Set Shipping Informations"
      @click.native="setShippingInformation"
    />
  </section>
</template>

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
      baseUrl                : baseUrl,
      config                 : this.$store.state.config,
      billingAddress         : billingAddress,
      shippingAddress        : {},
      paymentMethods         : this.$store.state.paymentMethods,
      shippingMethods        : this.$store.state.shippingMethods,
      shippingInformation    : this.$store.state.shippingInformation,
      totals                 : this.$store.state.totals,
      regionList             : regionList,
      isShippingAddressHidden: true,
      isRegionIdHidden       : false
    };
  },
  computed: {
    cartId() {
      return this.$store.state.cart;
    },
    step() {
      return this.$store.state.step;
    }
  },
  methods: {
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
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this
          .cartId}/shipping-information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.getShippingInformation())
        }
      ).then(response => {
        this.$store.commit('updateTotals', response.totals);
        this.getPaymentMethods();
        this.getShippingMethods();
        this.$store.commit('updateStep', 'methods');
      });
    },
    getShippingInformation() {
      const object                  = {},
            response                = this.shippingInformation.addressInformation,
            billingAddressForm      = this.$el.querySelector('.billing-address__form')
                                         .querySelectorAll('input, select, textarea'),
            shippingAddressCheckbox = this.$el.getElementById('shippingAddress'),
            shippingAddressForm     = this.$el.querySelector('.shipping-address__form')
                                          .querySelectorAll('input, select, textarea');

      this.settingData(billingAddressForm, response.billing_address);

      if (shippingAddressCheckbox.checked) {
        response.shipping_address = response.billing_address;
        response.shipping_address['same_as_billing'] = 1;
      } else {
        this.settingData(shippingAddressForm, response.shipping_address);
      }

      /*
       * Must set it to static b/c can't set only shipping address
       * API don't have endpoint to ONLY shipping address
       * Endpoint with billing address are useless in guest cart
       *
      **/
      response.shipping_method_code = 'flatrate';
      response.shipping_carrier_code = 'flatrate';

      object.addressInformation = response;
      this.$store.commit('updateShippingInformation', object);

      return object;
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
    getPaymentMethods() {
      /*
       * Getting payment methods by our shipping information which
       * we was setting before
       *
      **/
      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this
          .cartId}/payment-methods`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(response => {
        this.$store.commit('updatePaymentMethods', response);
      });
    },
    getShippingMethods() {
      /*
       * getting payment methods by our shipping information which
       * we was setting before
       *
      **/
      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this
          .cartId}/shipping-methods`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(response => {
        this.$store.commit('updateShippingMethods', response);
      });
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
    returnError(element, cssClass, text) {
      // Initial validation in future
    },
    toggleShippingAddress(event) {
      const element = event.srcElement;

      if (element.checked) {
        this.shippingAddress = {};

        if (!this.isShippingAddressHidden) {
          this.isShippingAddressHidden = true;
        }
      } else {
        this.shippingAddress = shippingAddress;

        if (this.isShippingAddressHidden) {
          this.isShippingAddressHidden = false;
        }
      }
    },
    cancelShippingInformations() {
      const shippingCheckbox = this.$el.getElementById('shippingAddress');

      this.shippingAddress = {};
      this.isShippingAddressHidden = true;
      shippingCheckbox.checked = true;
    }
  }
};
</script>
