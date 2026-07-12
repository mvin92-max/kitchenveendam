const priceFormatter = new Intl.NumberFormat("nl-NL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(price: number, priceIsFrom = false): string {
  return `${priceIsFrom ? "vanaf " : ""}€${priceFormatter.format(price)}`;
}
