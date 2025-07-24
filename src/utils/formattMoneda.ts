import currency from "currency.js";
export function formattMonedaGT(value: number | string): string {
  return currency(value, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
    pattern: "! #", // Ahora será: Q 1,234.56
  }).format();
}
