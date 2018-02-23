import Vue from 'vue'
import Vuex from 'vuex'

import request from '../api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    config: config,
    baseUrl: baseUrl,
    step: 'shipping',
    address: {
      billing: {
        'region_id': '',
        'country_id': '',
        'street': [],
        'company': '',
        'telephone': '',
        'postcode': '',
        'city': '',
        'firstname': '',
        'lastname': '',
        'email': ''
      },
      shipping: {
        'region_id': '',
        'country_id': '',
        'street': [],
        'company': '',
        'telephone': '',
        'postcode': '',
        'city': '',
        'firstname': '',
        'lastname': '',
        'email': ''
      }
    },
    paymentMethods: [],
    shippingMethods: [],
    shippingInformation: shippingInformation,
    totals: {},
    selectedMethods: selectedMethods,
    regionList: regionList
  },
  actions: {
    updateShippingMethods ({commit, state, getters}, countryId) {
      const conuntry = {
        "address": {
          "country_id": countryId
        }
      };

      request(
        `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/estimate-shipping-methods`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(conuntry)
        }
      )
        .then(response => {
          commit('updateShippingMethods', response);
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error);
        });
    },
    getPaymentMethods ({commit, state, getters}, countryId) {
      request(
        `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/payment-methods`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(response => {
          commit('updatePaymentMethods', response);
          commit('updateStep', 'payment');
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error);
        });
    },
    /**
     * Setting Payment Address
     * Push address to data
     * Shipping Information 2/2
     *
    **/
    setShippingInformation() {
      console.log('test');
      request(
        `${this.baseUrl}rest/V1/guest-carts/${this.cartId}/shipping-information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.getShippingInformation())
        }
      ).then(response => {
        this.$store.dispatch('setMethods');
        // Update step to summary is in setMethods method
      });
    },
    /**
     * Return totals informations and push to store
     *
    **/
    setMethods() {
      request(
        `${this.baseUrl}rest/V1/guest-carts/${this.cartId}/collect-totals`,
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
  },
  mutations: {
    updateStep (state, newStep) {
      state.step = newStep;
    },
    updatePaymentMethods(state, methods) {
      state.paymentMethods = methods;
    },
    updateShippingMethods(state, methods) {
      state.shippingMethods = methods;
    },
    updateTotals(state, newTotals) {
      state.totals = newTotals;
    },
    updateSelectedMethods(state, newSelectedMethods) {
      state.selectedMethods = newSelectedMethods;
    },
    setAddress (state, payload) {
      payload.address.forEach(item => {
        if (item.name.includes('street')) {
          state.address[payload.type]['street'].push(item.value)
        }
        else {
          state.address[payload.type][item.name] = item.value
        }
      })
    },
    setBillingAddres(state, payload) {
      if (payload.same_as_billing) {
        state.address['billing'] = state.address['shipping'];
      }
      else {
        state.address['billing'] = payload;
      }
    }
  },
  getters: {
    currencyCode (state) {
      return state.config.totalsData.base_currency_code;
    },
    cartId (state) {
      return state.config.quoteData.entity_id
    },
    regionsByCountryId: (state) => (countryId) => {
      return state.regionList.filter(region => region.country_id === countryId)
    }
  }
});

export default store
