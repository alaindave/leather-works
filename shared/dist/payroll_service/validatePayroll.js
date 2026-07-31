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
export function validatePayrolls(employees) {
    const errors = [];
    if (!employees || employees.length === 0) {
        errors.push("No employees provided");
        return {
            valid: false,
            message: errors.join(", "),
            errors,
        };
    }
    employees.forEach((employee, index) => {
        const result = validatePayroll(employee);
        if (!result.valid) {
            result.errors.forEach((error) => {
                errors.push(`Employee ${employee.employeeId || index + 1}: ${error}`);
            });
        }
    });
    return {
        valid: errors.length === 0,
        message: errors.length > 0 ? errors.join(", ") : undefined,
        errors,
    };
}
//# sourceMappingURL=validatePayroll.js.map