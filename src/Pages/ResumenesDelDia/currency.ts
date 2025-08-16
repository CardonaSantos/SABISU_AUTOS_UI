export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("GTQ", "Q");
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
