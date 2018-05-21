export function currency (price, code) {
  return parseFloat(price).toFixed(2) + ' ' + code
}

export function quantity (value) {
  return parseInt(value)
}
