export default interface PayrollSummary {
  payrollId: string;
  employeeId: string;
  employeeFirstName: string;
  employeeLastName: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  month: number;
  year: number;
  status: "DRAFT" | "APPROVED" | "PAID";
}
