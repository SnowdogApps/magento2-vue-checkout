export default {
  cartId(state) {
    return state.config.quoteData.entity_id
  },
  addressByType: (state) => (type) => {
    const address = { ...state[type] }
    address.street0 = address.street.length ? address.street[0] : ''
    address.street1 = address.street.length ? address.street[1] : ''
    delete address.street
    return address
  },
  regionsByCountryId: (state) => (countryId) => {
    if (countryId === null) {
      return []
    } else {
      return state.regions.filter((region) => region.country_id === countryId)
    }
  },
  isCustomerLoggedIn(state) {
    return state.config.isCustomerLoggedIn
  },
  totals(state) {
    return state.totals !== null ? state.totals : state.config.totalsData
  },
  couponCode(state, getters) {
    if (
      getters.totals.hasOwnProperty('coupon_code') &&
      getters.totals.coupon_code !== null
    ) {
      return getters.totals.coupon_code
    } else {
      return ''
    }
  }
}
