export function currencyFormat(value: number) {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  })
}
