import AdminUser, {
  PayrollEmployeeInput,
  PayrollResult,
  PayrollItem,
  PayrollBatchResult,
} from "./types.js";
import { calculateComponent } from "./calculateComponent.js";

//Calculate payroll for one employee
export function calculatePayroll(
  employee: PayrollEmployeeInput,
  admin: AdminUser
): PayrollResult {
  const earnings: PayrollItem[] = [];
  const deductions: PayrollItem[] = [];
  let grossSalary = employee.baseSalary;
  let totalEarnings = 0;
  let totalDeductions = 0;
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

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
    totalEarnings += amount;
    grossSalary += amount;
  }

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
    month,
    year,
    baseSalary: employee.baseSalary,
    grossSalary,
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    netSalary: grossSalary - totalDeductions,
    status: "BROUILLON",
  };
}

//Calculate payroll for all employees
export function calculatePayrolls(
  employees: PayrollEmployeeInput[],
  admin: AdminUser
): PayrollResult[] {
  return employees.map((employee) => calculatePayroll(employee, admin));
}

//Calculate payroll and return summary
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
