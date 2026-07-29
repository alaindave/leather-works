import { calculateComponent } from "./calculateComponent.js";
export function calculatePayroll(employee) {
    const earnings = [];
    const deductions = [];
    let grossSalary = employee.baseSalary;
    // First calculate earnings
    for (const component of employee.components) {
        if (component.type !== "EARNING")
            continue;
        const amount = calculateComponent(component, employee.baseSalary, grossSalary);
        earnings.push({
            componentId: component._id,
            name: component.name,
            type: component.type,
            amount,
        });
        grossSalary += amount;
    }
    let totalDeductions = 0;
    // Calculate deductions
    for (const component of employee.components) {
        if (component.type !== "DEDUCTION")
            continue;
        const amount = calculateComponent(component, employee.baseSalary, grossSalary);
        deductions.push({
            componentId: component._id,
            name: component.name,
            type: component.type,
            amount,
        });
        totalDeductions += amount;
    }
    return {
        employeeId: employee.employeeId,
        earnings,
        deductions,
        grossSalary,
        totalDeductions,
        netSalary: grossSalary - totalDeductions,
    };
}
//# sourceMappingURL=calculatePayroll.js.map