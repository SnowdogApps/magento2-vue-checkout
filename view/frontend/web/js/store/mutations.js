export default {
  setItem (state, {item, value}) {
    state[item] = value
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
}
