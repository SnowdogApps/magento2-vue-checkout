<template>
  <section
    class="shipping-address"
    v-if="step === 'shipping'"
  >
    <h1>
      Shipping address
    </h1>

    <form class="shipping-address__form">
      <template v-for="field in shippingAddress">
        <template v-if="field.type !== 'select'">
          <BaseInput
            :key="field.id"
            :label="field.label"
            :name="field.name"
            :type="field.type"
            :value="field.value"
            field-class="shipping-address__field"
            input-class="input shipping-address__input"
          />
        </template>

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
      </template>
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

    <BaseButton
      class="button"
      button-type="button"
      text="Set Shipping Informations"
      @click.native="setShippingInformation"
    />
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
      baseUrl            : baseUrl,
      config             : this.$store.state.config,
      isRegionIdHidden   : false,
      regionList         : regionList,
      shippingAddress    : shippingAddress,
      shippingInformation: this.$store.state.shippingInformation,
      totals             : this.$store.state.totals
    };
  },
  computed: {
    cartId() {
      return this.$store.state.cart;
    },
    step() {
      return this.$store.state.step;
    },
    shippingMethods() {
      return this.$store.state.shippingMethods;
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
      /**
       * Setting Shipping address and shipping method to object
       * Push data to store
       * Shipping Information set 1/2
      **/

      const object              = {},
            response            = this.shippingInformation.addressInformation,
            shippingAddressForm = this.$el.querySelector('.shipping-address__form')
                                      .querySelectorAll('input, select, textarea'),
            shippingMethod      = this.$el.querySelector('input[name="shipping"]:checked');

      this.settingData(shippingAddressForm, response.shipping_address);

      if (shippingMethod.value.length > 0) {
        response.shipping_carrier_code = shippingMethod.value;
        response.shipping_method_code = shippingMethod.dataset.methodCode;
      } else {
        this.returnError();
        return false;
      }

      object.addressInformation = response;

      this.$store.commit('updateShippingInformation', object);
      this.getPaymentMethods();
    },
    getPaymentMethods() {
      /*
       * Getting payment methods by our shipping information which
       * we was setting before
       *
      **/

      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/payment-methods`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(response => {
        this.$store.commit('updatePaymentMethods', response);
        this.$store.commit('updateStep', 'payment');
      });
    },
    getShippingMethods(countryId) {
      /**
       * Getting shipping methods by country ID
       * Update it in store
       *
      **/

      const conuntry = {
              "address": {
                "country_id": countryId
              }
            };

      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/estimate-shipping-methods`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(conuntry)
        }
      ).then(response => {
        this.$store.commit('updateShippingMethods', response);
      });
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

        this.getShippingMethods(eventOptionValue);

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
    returnError(element, cssClass, text) {
      // Initial validation in future
    }
  }
};
</script>
