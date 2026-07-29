import { PayrollEmployeeInput } from "./types";

export function validatePayroll(employee: PayrollEmployeeInput): string[] {
  const errors: string[] = [];

  if (!employee.employeeId) errors.push("Employee ID is required");

  if (employee.baseSalary < 0) errors.push("Salary cannot be negative");

  if (!employee.components) errors.push("Payroll components are required");

  return errors;
}
