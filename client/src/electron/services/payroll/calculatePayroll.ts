import AdminUser, {
  PayrollEmployeeInput,
  PayrollResult,
  PayrollItem,
  PayrollBatchResult,
} from "./types.js";

import {
  calculateComponent,
  PayrollCalculationContext,
} from "./calculateComponent.js";

// Calculate payroll for one employee
export function calculatePayroll(
  employee: PayrollEmployeeInput,
  admin: AdminUser
): PayrollResult {
  const earnings: PayrollItem[] = [];
  const deductions: PayrollItem[] = [];
  const baseSalary = employee.baseSalary;
  let totalEarnings = 0;
  let totalDeductions = 0;
  let grossSalary = baseSalary;
  let socialRate = 0;
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  /*
   * ============================================================
   * 1. CALCULATE ENABLED EARNINGS
   * ============================================================
   */

  for (const component of employee.components) {
    // Ignore disabled components
    if (component.enabled !== 1) continue;
    if (component.type !== "EARNING") continue;

    const context: PayrollCalculationContext = {
      baseSalary,
      grossSalary,
      taxableSalary: grossSalary,
      totalEarnings,
      totalDeductions,
      netSalary: grossSalary - totalDeductions,
    };

    const amount = calculateComponent(component, context);

    earnings.push({
      componentId: component._id,
      name: component.name,
      displayName: component.displayName,
      type: component.type,
      amount,
      taxable: component.taxable,
    });

    totalEarnings += amount;
    grossSalary += amount;
  }

  /*
   * ============================================================
   * 2. CALCULATE TAXABLE SALARY
   * ============================================================
   *
   */

  const taxableSalary =
    baseSalary +
    earnings
      .filter((item) => item.taxable === 1)
      .reduce((total, item) => total + item.amount, 0);

  /*
   * ============================================================
   * 3. CALCULATE ENABLED DEDUCTIONS
   * ============================================================
   */

  for (const component of employee.components) {
    // Ignore disabled components
    if (component.enabled !== 1) continue;
    if (component.type !== "DEDUCTION") continue;
    if (component.name === "SOCIAL_SECURITY") {
      socialRate = component.value ?? 0;
    }
    const context: PayrollCalculationContext = {
      employeeId: employee.employeeId,
      baseSalary,
      grossSalary,
      taxableSalary,
      socialRate,
      totalEarnings,
      totalDeductions,
      netSalary: grossSalary - totalDeductions,
    };

    const amount = calculateComponent(component, context);

    deductions.push({
      componentId: component._id,
      name: component.name,
      displayName: component.displayName,
      type: component.type,
      amount,
    });

    totalDeductions += amount;
  }

  /*
   * ============================================================
   * 4. FINAL NET SALARY
   * ============================================================
   */

  const netSalary = grossSalary - totalDeductions;

  /*
   * ============================================================
   * 5. RETURN PAYROLL RESULT
   * ============================================================
   */

  return {
    employeeId: employee.employeeId,
    generatedBy: admin._id,
    month,
    year,
    baseSalary,
    grossSalary,
    taxableSalary,
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    netSalary,
    status: "BROUILLON",
  };
}

// Calculate payroll for all employees
export function calculatePayrolls(
  employees: PayrollEmployeeInput[],
  admin: AdminUser
): PayrollResult[] {
  return employees.map((employee) => calculatePayroll(employee, admin));
}

// Calculate payroll and return summary
export function calculatePayrollsWithSummary(
  employees: PayrollEmployeeInput[],
  admin: AdminUser
): PayrollBatchResult {
  const results = calculatePayrolls(employees, admin);

  return {
    results,

    employeeCount: results.length,

    totalBasicSalary: results.reduce(
      (sum, result) => sum + result.baseSalary,
      0
    ),

    totalEarnings: results.reduce(
      (sum, result) => sum + result.totalEarnings,
      0
    ),

    totalDeductions: results.reduce(
      (sum, result) => sum + result.totalDeductions,
      0
    ),
    totalNetSalary: results.reduce((sum, result) => sum + result.netSalary, 0),
  };
}
