export function validatePayroll(employee) {
    const errors = [];
    if (!employee.employeeId) {
        errors.push("Employee ID is required");
    }
    if (employee.baseSalary < 0) {
        errors.push("Salary cannot be negative");
    }
    if (!employee.components || employee.components.length === 0) {
        errors.push("Payroll components are required");
    }
    return {
        valid: errors.length === 0,
        message: errors.join(", "),
        errors,
    };
}
//# sourceMappingURL=validatePayroll.js.map