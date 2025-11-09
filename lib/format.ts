export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function formatPercentage(value: number) {
  return `${value.toFixed(1)}%`;
}
