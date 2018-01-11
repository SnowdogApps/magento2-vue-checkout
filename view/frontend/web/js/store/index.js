import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    config: config,
    baseUrl: baseUrl,
    step: 'shipping',
    address: {
      billing: {
        'region': '',
        'region_id': '',
        'region_code': '',
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
        'region': '',
        'region_id': '',
        'region_code': '',
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

      fetch(
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
          if (response.ok) {
            return response;
          }
          throw Error(response.statusText);
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          commit('updateShippingMethods', response);
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error);
        });
    },
    getPaymentMethods ({commit, state, getters}, countryId) {
      fetch(
        `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/payment-methods`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(response => {
          if (response.ok) {
            return response;
          }
          throw Error(response.statusText);
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          commit('updatePaymentMethods', response);
          commit('updateStep', 'payment');
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error);
        });
    }
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
