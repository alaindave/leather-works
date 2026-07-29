"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayroll = validatePayroll;
function validatePayroll(employee) {
    const errors = [];
    if (!employee.employeeId)
        errors.push("Employee ID is required");
    if (employee.baseSalary < 0)
        errors.push("Salary cannot be negative");
    if (!employee.components)
        errors.push("Payroll components are required");
    return errors;
}
//# sourceMappingURL=validatePayroll.js.map