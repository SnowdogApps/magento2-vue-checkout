import Vue from 'vue'
import Vuex from 'vuex'
import regions from '../data/regions.json'
import axios from 'axios'

Vue.use(Vuex)

/* global config, baseUrl */

const store = new Vuex.Store({
  state: {
    config,
    baseUrl,
    regions,
    step: 'shipping',
    orderId: null,
    shippingMethods: [],
    shipping_address: {
      city: '',
      company: '',
      country_id: '',
      firstname: '',
      lastname: '',
      postcode: '',
      region: '',
      region_id: '',
      street: [],
      telephone: ''
    },
    billing_address: {
      city: '',
      company: '',
      country_id: '',
      firstname: '',
      lastname: '',
      postcode: '',
      region: '',
      region_id: '',
      street: [],
      telephone: ''
    },
    shipping_method_code: '',
    shipping_carrier_code: '',
    paymentMethods: [],
    customer: {
      email: null
    },
    selectedMethods: {
      paymentMethod: {
        method: ''
      },
      shippingCarrierCode: '',
      shippingMethodCode: ''
    },
    totals: {}
  },
  actions: {
    updateShippingMethods ({commit, state, getters}, countryId) {
      const data = {
        'address': {
          'country_id': countryId
        }
      }

      let url = `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/estimate-shipping-methods`
      if (getters.isCustomerLoggedIn) {
        url = `${state.baseUrl}rest/V1/carts/mine/estimate-shipping-methods`
      }

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        url
      }

      axios(options)
        .then(({data}) => {
          commit('setShippingMethods', data)
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error)
        })
    },
    setShippinInformation ({commit, state, getters}, selectedShippingMethod) {
      let url = `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/shipping-information`
      if (getters.isCustomerLoggedIn) {
        url = `${state.baseUrl}rest/V1/carts/mine/shipping-information`
      }

      const shippingInformation = {
        addressInformation: {
          shipping_method_code: selectedShippingMethod.method_code,
          shipping_carrier_code: selectedShippingMethod.carrier_code
        }
      }

      const shippingAddress = { ...state.shipping_address }
      shippingAddress.country_id = state.shipping_address.country_id.value

      if (getters.regionsByCountryId(shippingAddress.country_id).length) {
        shippingAddress.region_id = state.shipping_address.region_id.value
        delete shippingAddress.region
      } else {
        delete shippingAddress.region_id
      }

      shippingInformation.addressInformation.shipping_address = shippingAddress

      if (state.billing_address.city === '') {
        shippingInformation.addressInformation.billing_address = shippingAddress
      } else {
        const billingAddress = { ...state.billing_address }

        billingAddress.country_id = state.billing_address.country_id.value

        if (getters.regionsByCountryId(billingAddress.country_id).length) {
          billingAddress.region_id = state.shipping_address.region_id.value
          delete billingAddress.region
        } else {
          delete billingAddress.region_id
        }

        shippingInformation.addressInformation.billing_address = billingAddress
      }

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(shippingInformation),
        url
      }

      axios(options)
        .then(({data}) => {
          commit('setPaymentMethods', data.payment_methods)
          commit('setStep', 'payment')
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error)
        })
    },
    placeOrder ({commit, state, getters}, paymentMethod) {
      let url = `${state.baseUrl}rest/V1/guest-carts/${getters.cartId}/payment-information`
      if (getters.isCustomerLoggedIn) {
        url = `${state.baseUrl}rest/V1/carts/mine/payment-information`
      }

      const billingAddress = { ...state.billing_address }
      billingAddress.country_id = state.billing_address.country_id.value

      if (getters.regionsByCountryId(billingAddress.country_id).length) {
        billingAddress.region_id = state.shipping_address.region_id.value
        delete billingAddress.region
      } else {
        delete billingAddress.region_id
      }

      const data = {
        'billingAddress': billingAddress,
        'email': state.customer.email,
        'paymentMethod': {
          'method': paymentMethod.code
        }
      }

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        url
      }

      axios(options)
        .then(({data}) => {
          commit('setStep', 'success')
          commit('setOrderId', data)
        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error)
        })
    }
  },
  mutations: {
    setStep (state, payload) {
      state.step = payload
    },
    setOrderId (state, payload) {
      state.orderId = payload
    },
    setPaymentMethods (state, payload) {
      state.paymentMethods = payload
    },
    setShippingMethods (state, payload) {
      state.shippingMethods = payload
    },
    updateTotals (state, payload) {
      state.totals = payload
    },
    copyShippingAddress (state) {
      state.billing_address = state.shipping_address
    },
    setCustomerEmail (state, payload) {
      state.customer.email = payload
    },
    setAddress (state, payload) {
      const address = payload.address
      const type = payload.type

      state[type] = {}
      Object.keys(address).forEach(item => {
        if (item.includes('street')) {
          if (!state[type].hasOwnProperty('street')) {
            state[type]['street'] = []
          }
          state[type]['street'].push(address[item])
        } else {
          state[type][item] = address[item]
        }
      })
    }
  },
  getters: {
    currencyCode (state) {
      return state.config.totalsData.base_currency_code
    },
    cartId (state) {
      return state.config.quoteData.entity_id
    },
    addressByType: (state) => (type) => {
      let address = Object.assign({}, state[type])
      address.street0 = address.street.length ? address.street[0] : ''
      address.street1 = address.street.length ? address.street[1] : ''
      delete address.street
      return address
    },
    regionsByCountryId: (state) => (countryId) => {
      return state.regions.filter(region => region.country_id === countryId)
    },
    isCustomerLoggedIn (state) {
      return state.config.isCustomerLoggedIn
    }
  }
})

export default store
