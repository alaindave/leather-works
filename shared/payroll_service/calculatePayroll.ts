import AdminUser, {
  PayrollEmployeeInput,
  PayrollResult,
  PayrollItem,
} from "./types.js";
import { calculateComponent } from "./calculateComponent.js";

/**
 * Calculate payroll for a single employee
 */
export function calculatePayroll(
  employee: PayrollEmployeeInput,
  admin: AdminUser
): PayrollResult {
  const earnings: PayrollItem[] = [];
  const deductions: PayrollItem[] = [];
  let grossSalary = employee.baseSalary;

  // First calculate earnings
  for (const component of employee.components) {
    if (component.type !== "EARNING") continue;

    const amount = calculateComponent(
      component,
      employee.baseSalary,
      grossSalary
    );

    earnings.push({
      componentId: component._id,
      name: component.name,
      type: component.type,
      amount,
    });

    grossSalary += amount;
  }

  // Calculate deductions
  let totalDeductions = 0;

  for (const component of employee.components) {
    if (component.type !== "DEDUCTION") continue;

    const amount = calculateComponent(
      component,
      employee.baseSalary,
      grossSalary
    );

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
    generatedBy: admin._id,
    earnings,
    deductions,
    grossSalary,
    totalDeductions,
    netSalary: grossSalary - totalDeductions,
  };
}

/**
 * Calculate payroll for all employees
 */
export function calculatePayrolls(
  employees: PayrollEmployeeInput[],
  admin: AdminUser
): PayrollResult[] {
  return employees.map((employee) => calculatePayroll(employee, admin));
}

/**
 * Optional summary helper
 */
export interface PayrollBatchResult {
  results: PayrollResult[];

  totalGrossSalary: number;

  totalDeductions: number;

  totalNetSalary: number;
}

/**
 * Calculate payrolls and return company totals
 */
export function calculatePayrollsWithSummary(
  employees: PayrollEmployeeInput[],
  admin: AdminUser
): PayrollBatchResult {
  const results = calculatePayrolls(employees, admin);

  return {
    results,

    totalGrossSalary: results.reduce(
      (sum, result) => sum + result.grossSalary,
      0
    ),

    totalDeductions: results.reduce(
      (sum, result) => sum + result.totalDeductions,
      0
    ),

    totalNetSalary: results.reduce((sum, result) => sum + result.netSalary, 0),
  };
}
