<template>
  <section
    class="methods"
    v-if="step === 'methods'"
  >
    <h1>
      Choose shipping and payment methods
    </h1>

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
      @click.native="setMethods"
    />

    <BaseButton
      class="button"
      button-type="button"
      text="Back"
      @click.native="changeStep('addresses')"
    />
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue';
import BasePaymentMethods from '../BasePaymentMethods.vue';
import BaseShippingMethods from '../BaseShippingMethods.vue';

export default {
  components: {
    BaseButton,
    BasePaymentMethods,
    BaseShippingMethods
  },
  data() {
    return {
      baseUrl        : baseUrl,
      config         : this.$store.state.config,
      selectedMethods: this.$store.state.selectedMethods
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
    },
    paymentMethods() {
      return this.$store.state.paymentMethods;
    },
    shippingInformation() {
      return this.$store.state.shippingInformation;
    },
    totals() {
      return this.$store.state.totals;
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
    setMethods() {
      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this
          .cartId}/collect-totals`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.getSelectedMethods())
        }
      ).then(response => {
        this.$store.commit('updateTotals', response);
        this.getSummary();
        this.$store.commit('updateStep', 'summary');
      });
    },
    getSelectedMethods() {
      const returnObj      = this.selectedMethods,
            shippingMethod = this.$el.querySelector('input[name = "shipping"]: checked'),
            paymentMethod  = this.$el.querySelector('input[name="payment"]:checked');

      if (shippingMethod.value.length > 0) {
        returnObj.shippingCarrierCode = shippingMethod.value;
        returnObj.shippingMethodCode = shippingMethod.dataset.methodCode;
      } else {
        this.returnError();
        return false;
      }

      if (paymentMethod.value.length > 0) {
        returnObj.paymentMethod.method = paymentMethod.value;
      } else {
        this.returnError();
        return false;
      }

      this.$store.commit('updateSelectedMethods', returnObj);

      return returnObj;
    },
    getSummary() {
      const shippingMethodCode = this.shippingInformation;

      /**
       * Update static shipping method - now it's choosen
       * Must use this endpoint again
       *
      **/
      shippingMethodCode.addressInformation.shipping_method_code = this.selectedMethods.shippingMethodCode;
      shippingMethodCode.addressInformation.shipping_carrier_code = this.selectedMethods.shippingCarrierCode;

      this.$store.commint('updateShippingInformation', shippingMethodCode);

      this.request(
        `${this.baseUrl}index.php/rest/V1/guest-carts/${this
          .cartId}/shipping-information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(shippingMethodCode)
        }
      ).then(response => {
        this.request(
          `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/totals`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then(response => {
          this.$store.commit('updateTotals', response);
        });
      });
    }
  }
};
</script>
