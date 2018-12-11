import Vue from 'vue'
import Vuex from 'vuex'
import regions from '../data/regions.json'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const config = window.snowdog.config ? window.snowdog.config : {}
const baseUrl = window.snowdog.baseUrl ? window.snowdog.baseUrl : {}

const store = new Vuex.Store({
  state: {
    config,
    baseUrl,
    regions,
    customer: {
      email: null
    },
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
  },
  actions,
  mutations,
  getters
})

export default store
