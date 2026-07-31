import AdminUser, { PayrollEmployeeInput, PayrollResult } from "./types.js";
/**
 * Calculate payroll for a single employee
 */
export declare function calculatePayroll(employee: PayrollEmployeeInput, admin: AdminUser): PayrollResult;
/**
 * Calculate payroll for all employees
 */
export declare function calculatePayrolls(employees: PayrollEmployeeInput[], admin: AdminUser): PayrollResult[];
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
export declare function calculatePayrollsWithSummary(employees: PayrollEmployeeInput[], admin: AdminUser): PayrollBatchResult;
//# sourceMappingURL=calculatePayroll.d.ts.map