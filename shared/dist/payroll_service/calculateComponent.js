export function calculateComponent(component, context) {
    switch (component.calculationType) {
        case "FIXE":
            return component.value ?? 0;
        case "MANUEL":
            return component.value ?? 0;
        case "POURCENTAGE_BASE":
            return context.baseSalary * ((component.value ?? 0) / 100);
        case "POURCENTAGE_BRUT":
            return context.grossSalary * ((component.value ?? 0) / 100);
        case "POURCENTAGE_IMPOSABLE":
            return context.taxableSalary * ((component.value ?? 0) / 100);
        case "QUANTITE_TAUX":
            return (component.quantity ?? 0) * (component.rate ?? 0);
        case "FORMULE":
            // Formula calculation can be implemented separately.
            return 0;
        default:
            return 0;
    }
}
function getCalculationBase(calculationBase, context) {
    switch (calculationBase) {
        case "BASE_SALARY":
            return context.baseSalary;
        case "GROSS_SALARY":
            return context.grossSalary;
        case "TAXABLE_SALARY":
            return context.taxableSalary;
        case "TOTAL_EARNINGS":
            return context.totalEarnings;
        case "TOTAL_DEDUCTIONS":
            return context.totalDeductions;
        case "NET_SALARY":
            return context.netSalary;
        default:
            return 0;
    }
}
//# sourceMappingURL=calculateComponent.js.map