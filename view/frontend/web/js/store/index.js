import Vue from "vue";
import Vuex from "vuex";
import regions from "../data/regions.json";

import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    config: window.config,
    baseUrl: window.baseUrl,
    customer: null,
    regions,
    step: "shipping",
    orderId: null,
    shippingMethods: [],
    selectedShippingMethod: null,
    selectedPaymentMethod: null,
    shippingAddress: null,
    billingAddress: null,
    newBillingAddress: null,
    paymentMethods: [],
    totals: null,
  },
  actions,
  mutations,
  getters,
});

export default store;
