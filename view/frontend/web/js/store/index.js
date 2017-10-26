import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    config: config,
    step: 'addresses',
    cart: '',
    paymentMethods: [],
    shippingMethods: [],
    shippingInformation: shippingInformation,
    totals: {},
    selectedMethods: selectedMethods,
    regionList: regionList
  },
  mutations: {
    updateStep (state, newStep) {
      state.step = newStep;
    },
    setCartId(state, id) {
      state.cart = id;
    },
    updatePaymentMethods(state, methods) {
      state.paymentMethods = methods;
    },
    updateShippingMethods(state, methods) {
      state.shippingMethods = methods;
    },
    updateShippingInformation(state, newShippingInfo) {
      state.shippingInformation = newShippingInfo;
    },
    updateTotals(state, newTotals) {
      state.totals = newTotals;
    },
    updateSelectedMethods(state, newSelectedMethods) {
      state.selectedMethods = newSelectedMethods;
    }
  }
});

export default store
