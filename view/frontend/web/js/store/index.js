// import Vue from "vue";
// import Vuex from "vuex";
import regions from '@/data/regions.json'
import axios from 'axios'

// import actions from "./actions";
// import mutations from "./mutations";
// import getters from "./getters";

// Vue.use(Vuex);

// const store = new Vuex.Store({
//   state: {
//     config: window.config,
//     baseUrl: window.baseUrl,
//     customer: null,
//     regions,
//     step: "shipping",
//     orderId: null,
//     shippingMethods: [],
//     selectedShippingMethod: null,
//     selectedPaymentMethod: null,
//     shippingAddress: null,
//     billingAddress: null,
//     newBillingAddress: null,
//     paymentMethods: [],
//     totals: null,
//   },
//   actions,
//   mutations,
//   getters,
// });

// export default store;

import { defineStore } from 'pinia'

export const useStore = defineStore('checkout', {
  state: () => ({
    config: window.config,
    baseUrl: window.baseUrl,
    customer: null,
    regions,
    step: 'shipping',
    orderId: null,
    shippingMethods: [],
    selectedShippingMethod: null,
    selectedPaymentMethod: null,
    shippingAddress: null,
    billingAddress: null,
    newBillingAddress: null,
    paymentMethods: [],
    totals: null
  }),
  getters: {
    isCustomerLoggedIn: (state) => state.config.isCustomerLoggedIn,
    getCartId: (state) => state.config.quoteData.entity_id,
    getAddressByType: (state) => (type) => {
      if (state[type] === null) {
        return null
      }
      const address = { ...state[type] }
      address.street0 = address.street.length ? address.street[0] : ''
      address.street1 = address.street.length ? address.street[1] : ''
      delete address.street
      return address
    },
    getRegionsByCountryId: (state) => (countryId) => {
      if (countryId === null) {
        return []
      } else {
        return state.regions.filter((region) => region.country_id === countryId)
      }
    }
  },
  actions: {
    async updateShippingMethods(countryId) {
      const payload = {
        address: {
          country_id: countryId
        }
      }

      let url = `/rest/V1/guest-carts/${this.getCartId}/estimate-shipping-methods`
      if (this.isCustomerLoggedIn) {
        url = '/rest/V1/carts/mine/estimate-shipping-methods'
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: JSON.stringify(payload),
        url
      }

      try {
        const { data } = await axios(options)
        this.shippingMethods = data
      } catch (error) {
        console.error('Looks like there was a problem: \n', error)
      }
    }
  }
})
