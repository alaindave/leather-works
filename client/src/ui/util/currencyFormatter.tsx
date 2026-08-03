export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "0 FBU";
  }

  return ` ${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)} FBU `;
}
