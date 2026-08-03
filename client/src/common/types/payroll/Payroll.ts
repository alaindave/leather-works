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
  employeeCount: number;
  totalBasicSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  totalNetSalary: number;
  generatedBy: string;
  generatedByName?: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  paidBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  status: PayrollStatus;
  synced: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
}

export interface PayrollResultRecord {
  _id: string;
  payrollRunId: string;
  month: number;
  year: number;
  employeeId: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  baseSalary: number;
  grossSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  status: "BROUILLON" | "EN_VERIFICATION" | "APPROUVÉ" | "PAYÉ" | "ANNULÉ";
  netSalary: number;
  createdAt: string;
  updatedAt: string;
}
