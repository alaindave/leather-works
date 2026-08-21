export function formatCurrency(
  value: number | null | undefined,
  currency: string = "BIF"
): string {
  if (value === null || value === undefined) {
    return `0 ${currency}`;
  }

  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)} ${currency}`;
}
