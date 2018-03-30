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
    shippingInformation: {
      "addressInformation": {
        "shipping_address": {
            "region": "string",
            "region_id": 0,
            "country_id": "string",
            "street": [
                "string"
            ],
            "company": "string",
            "telephone": "string",
            "postcode": "string",
            "city": "string",
            "firstname": "string",
            "lastname": "string",
            "email": "string",
            "same_as_billing": 0
        },
        "billing_address": {
            "region": "string",
            "region_id": 0,
            "region_code": "string",
            "country_id": "string",
            "street": [
                "string"
            ],
            "company": "string",
            "telephone": "string",
            "postcode": "string",
            "city": "string",
            "firstname": "string",
            "lastname": "string",
            "email": "string"
        },
        "shipping_method_code": "string",
        "shipping_carrier_code": "string"
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
      state.shippingInformation.addressInformation.shipping_address = state.address.shipping;
      state.shippingInformation.addressInformation.billing_address = state.address.shipping;
      state.shippingInformation.addressInformation.shipping_method_code = selectedShippingMethod.method_code;
      state.shippingInformation.addressInformation.shipping_carrier_code = selectedShippingMethod.carrier_code;
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
    },
    billingAddress (state) {
      return state.shippingInformation.addressInformation.billing_address
    }
  }
});

export default store
