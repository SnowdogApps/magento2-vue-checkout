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
    selectedShippingMethod: {},
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
    },
    async fetchCustomerData() {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        url: '/rest/V1/customers/me'
      }

      try {
        const { data } = await axios(options)
        this.customer = data
      } catch (error) {
        console.error('Looks like there was a problem: \n', error)
      }
    },
    async setShippinInformation() {
      let url = `/rest/V1/guest-carts/${this.getCartId}/shipping-information`
      if (this.isCustomerLoggedIn) {
        url = '/rest/V1/carts/mine/shipping-information'
      }

      const shippingInformation = {
        addressInformation: {
          shipping_method_code: this.selectedShippingMethod.method_code,
          shipping_carrier_code: this.selectedShippingMethod.carrier_code
        }
      }

      this.billingAddress = this.shippingAddress
      const shippingAddress = { ...this.shippingAddress }

      // Parse streed data format
      shippingAddress.street = [shippingAddress.street0, shippingAddress.street1]
      delete shippingAddress.street0
      delete shippingAddress.street1

      // Set region data
      if (this.getRegionsByCountryId(shippingAddress.country_id).length) {
        shippingAddress.region_id = this.shippingAddress.region_id
        delete shippingAddress.region
      } else {
        delete shippingAddress.region_id
      }

      shippingInformation.addressInformation.shipping_address = shippingAddress
      // Copy shipping address to billing address (can't send empty object)
      shippingInformation.addressInformation.billing_address = shippingAddress

      const options = {
        method: 'POST',
        data: JSON.stringify(shippingInformation),
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        url
      }

      try {
        const { data } = await axios(options)
        this.paymentMethods = data.payment_methods
        this.totals = data.totals
        this.step = 'payment'
      } catch (error) {
        console.error('Looks like there was a problem: \n', error)
      }
    }
  }
})
