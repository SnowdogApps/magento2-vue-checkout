<template>
  <section v-if="step === 'summary'">
    <h1>
      Summary
    </h1>

    <BaseSummary
      :items="totals.total_segments"
      :discount-amout="totals.discount_amount"
      :items-qty="totals.items_qty"
      :currency-code="totals.base_currency_code"
    />

    <BaseButton
      class="button"
      button-type="button"
      text="Place order"
      @click.native="makeOrder"
    />

    <BaseButton
      class="button"
      button-type="button"
      text="Back"
      @click.native="changeStep('payment')"
    />
  </section>
</template>

<script>
import BaseButton from '../BaseButton.vue'
import BaseSummary from '../BaseSummary.vue'

export default {
  components: {
    BaseButton,
    BaseSummary,
  },
  data() {
    return {
      baseUrl: baseUrl,
      config : this.$store.state.config
    }
  },
  computed: {
    cartId() {
      return this.$store.state.cart;
    },
    step() {
      return this.$store.state.step;
    },
    totals() {
      return this.$store.state.totals;
    },
    selectedMethods() {
      return this.$store.state.selectedMethods;
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
    makeOrder() {
      /**
       * Placing an order in M2
       *
      **/

      this.request(
        `${this.baseUrl}rest/V1/guest-carts/${this.cartId}/order`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "paymentMethod": {
              "method": this.selectedMethods.paymentMethod.method,
            }
          })
        }
      )
        .then(response => {
          this.$store.commit('updateStep', 'success');
        })
    }
  }
}
</script>
