import PayrollItem from "./PayrollItem.js";

export type PayrollStatus = "DRAFT" | "APPROVED" | "PAID";

export default interface Payroll {
  _id: string;
  employeeId: string;
  generatedBy?: string;
  month: number;
  year: number;
  earnings: PayrollItem[];
  deductions: PayrollItem[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  notes?: string;
  status: PayrollStatus;
  synced: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
}
