const config = window.snowdog.config ? window.snowdog.config : {}

export function currency (price) {
  price = parseFloat(price).toFixed(2)
  return config.basePriceFormat.pattern.replace('%s', price)
}

export function quantity (value) {
  return parseInt(value)
}
