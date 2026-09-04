export const getMonthName = (month: number): string => {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  return months[month - 1] ?? "";
};

export function getPayrollPeriod(month: number, year: number): string {
  const endDay = new Date(year, month, 0).getDate();

  const monthName = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
  }).format(new Date(year, month - 1, 1));

  return `1 au ${endDay} ${monthName} ${year}`;
}
