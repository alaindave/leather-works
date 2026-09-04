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

export function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
