import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    config: config,
    baseUrl: baseUrl,
    step: 'shipping',
    paymentMethods: [],
    shippingMethods: [],
    shippingInformation: {
      addressInformation: {
        shipping_address: {},
        billing_address: {},
        shipping_method_code: '',
        shipping_carrier_code: ''
    }
    },
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
    setShippinInformation ({commit, state, getters}) {
      fetch(
        `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/shipping-information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(state.shippingInformation)
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
          commit('updatePaymentMethods', response.payment_methods);
          commit('updateStep', 'payment');
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error);
        });
    },
    placeOrder ({commit, state, getters}, paymentMethod) {
      fetch(
        `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/payment-information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "billingAddress": state.shippingInformation.addressInformation.billing_address,
            "email": "test@gmail.com",
            "paymentMethod": {
              "method": paymentMethod.code
            }
          })
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
        console.log("Order id: " + response);
        commit('updateStep', 'success');
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
    setShippinInformation(state, selectedShippingMethod) {
      state.shippingInformation.addressInformation.billing_address = state.shippingInformation.addressInformation.shipping_address;
      state.shippingInformation.addressInformation.shipping_method_code = selectedShippingMethod.method_code;
      state.shippingInformation.addressInformation.shipping_carrier_code = selectedShippingMethod.carrier_code;
    },
    setAddress (state, payload) {
      const address = payload.address;
      const type = payload.type;

      console.log(address);
      console.log(type);
      state.shippingInformation.addressInformation[type] = {}
      Object.keys(address).forEach(item => {
        if (item.includes('street')) {
          if (!state.shippingInformation.addressInformation[type].hasOwnProperty('street')) {
            state.shippingInformation.addressInformation[type]['street'] = []
          }
          state.shippingInformation.addressInformation[type]['street'].push(address[item])
        }
        else {
          if (item === 'region' && address[item] !== '' ||
            item === 'region_id' && address[item] !== '' ||
            item !== 'region' && item !== 'region_id'
          ) {
            state.shippingInformation.addressInformation[type][item] = address[item]
          }
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
    },
    billingAddress (state) {
      return state.shippingInformation.addressInformation.billing_address
    }
  }
});

export default store
