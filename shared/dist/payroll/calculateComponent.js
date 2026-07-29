export function calculateComponent(component, baseSalary, grossSalary) {
    switch (component.calculationType) {
        case "FIXE":
            return component.value;
        case "POURCENTAGE":
            if (component.percentageOf === "GROSS_SALARY") {
                return grossSalary * (component.value / 100);
            }
            return baseSalary * (component.value / 100);
        case "MANUEL":
            return component.value;
        default:
            return 0;
    }
}
//# sourceMappingURL=calculateComponent.js.map