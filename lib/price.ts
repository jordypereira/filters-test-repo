export const normalizePrice = (price: number) => price / 100.0

export const price: Helpers.PriceHelper = (price, normalizeDecimals?, skipDecimalZeros = true) => {
  const storefrontStore = useStorefrontStore()
  const { currency } = storefrontStore.currentMarket

  if (typeof price === 'string') price = parseInt(price)
  if (typeof price === 'object') price = price.final

  if (normalizeDecimals) {
    price = normalizePrice(price)
  }

  price = price.toFixed(2)
  if (skipDecimalZeros && price.includes('.00')) {
    const parsedPrice = price.slice(0, price.length - 3)
    price = parseInt(parsedPrice)
  }

  switch (currency.code) {
    case 'GBP':
    case 'AUD':
    case 'JPY':
    case 'KRW':
      return `${currency.symbol}${price}`
    case 'CHF':
      return `${currency.symbol} ${price}`
    default:
      return `${price} ${currency.symbol}`
  }
}
