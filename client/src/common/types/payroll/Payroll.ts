import PayrollItem from "./PayrollItem.js";

export type PayrollStatus =
  | "BROUILLON"
  | "EN_VERIFICATION"
  | "APPROUVÉ"
  | "PAYÉ"
  | "ANNULÉ";

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

export interface PayrollRun {
  _id: string;
  month: number;
  year: number;
  generatedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  status: PayrollStatus;
  synced: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
}

export interface PayrollResultRecord {
  _id: string;
  generatedBy: string;
  payrollRunId: string;
  employeeId: string;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  createdAt: string;
}
