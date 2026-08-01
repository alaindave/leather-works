import AdminUser, { PayrollEmployeeInput, PayrollResult, PayrollBatchResult } from "./types.js";
export declare function calculatePayroll(employee: PayrollEmployeeInput, admin: AdminUser): PayrollResult;
export declare function calculatePayrolls(employees: PayrollEmployeeInput[], admin: AdminUser): PayrollResult[];
export declare function calculatePayrollsWithSummary(employees: PayrollEmployeeInput[], admin: AdminUser): PayrollBatchResult;
//# sourceMappingURL=calculatePayroll.d.ts.map