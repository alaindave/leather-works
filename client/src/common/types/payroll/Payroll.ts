export interface PayrollSettings {
  _id: string;
  currency: string;
  workingDays: number;
  workingHours: number;
  paymentDay: number;
  synced: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
  isDeleted: number;
}

export type PayrollStatus =
  | "BROUILLON"
  | "VERIFICATION"
  | "APPROUVÉ"
  | "PAYÉ"
  | "ANNULÉ";

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
  submittedForVerificationAt?: string;
  submittedForVerificationBy?: string;
  submittedForVerificationByName?: string;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  paidAt?: string;
  paidBy?: string;
  paidByName?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelledByName?: string;
  status: PayrollStatus;
  notes?: string;
  synced: number;
  isDeleted: number;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
}

export interface PayrollResult {
  _id?: string;
  generatedBy: string;
  payrollRunId?: string;
  month: number;
  year: number;
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  baseSalary: number;
  grossSalary: number;
  taxableSalary: number;
  earnings: PayrollItem[];
  deductions: PayrollItem[];
  totalEarnings: number;
  totalDeductions: number;
  status: "BROUILLON" | "VERIFICATION" | "APPROUVÉ" | "PAYÉ" | "ANNULÉ";
  cancelledAt?: string;
  verifiedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  netSalary: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: number;
}

export type PayrollComponentType = "EARNING" | "DEDUCTION";

export type CalculationType =
  | "FIXE"
  | "POURCENTAGE_BRUT"
  | "POURCENTAGE_BASE"
  | "POURCENTAGE_IMPOSABLE"
  | "MANUEL"
  | "QUANTITE_TAUX"
  | "FORMULE_IPR"
  | "FORMULE_ABSENCE"
  | "FORMULE_RETARD";

export interface PayrollComponentInput {
  _id?: string;
  name: string;
  displayName?: string;
  displayOrder: number;
  type: PayrollComponentType;
  calculationType: CalculationType;
  calculationBase?:
    | "BASE_SALARY"
    | "GROSS_SALARY"
    | "TAXABLE_SALARY"
    | "TOTAL_EARNINGS"
    | "TOTAL_DEDUCTIONS"
    | "NET_SALARY";
  value?: number | null;
  quantity?: number | null;
  rate?: number | null;
  formula?: string | null;
  taxable?: number;
  enabled: number;
}

export interface PayrollItem {
  _id?: string;
  employeeId?: string;
  payrollResultId?: string;
  componentId?: string;
  name: string;
  displayName?: string;
  type: PayrollComponentType;
  amount: number;
  calculationMethod?: string;
  rate?: number;
  taxable?: number;
  quantity?: number;
  notes?: string;
  synced?: number;
  isDeleted?: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
}

//Payroll Summary interface
export interface PayrollBatchResult {
  results: PayrollResult[];
  employeeCount: number;
  totalBasicSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  totalNetSalary: number;
}

export interface PayrollAttendanceSummary {
  employeeId: string;
  lateDays: number;
  totalLateMinutes: number;
  absentDays: number;
}

export interface PayrollEmployeeInput {
  employeeId: string;
  attendance?: PayrollAttendanceSummary;
  baseSalary: number;
  components: PayrollComponentInput[];
}

export interface PayrollCalculationContext {
  employeeId?: string;
  payrollSettings: PayrollSettings;
  lateDays: number;
  totalLateMinutes: number;
  absentDays: number;
  baseSalary: number;
  grossSalary: number;
  taxableSalary: number;
  socialRate?: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
}

export interface PayrollItem {
  _id?: string;
  payrollResultId?: string;
  componentId?: string;
  name: string;
  displayName?: string;
  type: PayrollComponentType;
  amount: number;
  // Fields for audit
  calculationMethod?: string; // "Fixed", "Percentage", "Formula"
  rate?: number; // e.g. 3 for 3%
  taxable?: number;
  quantity?: number; // e.g. overtime hours
  notes?: string; // "15 overtime hours × 5,000 BIF"
  synced?: number;
  isDeleted?: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
}

//Payroll Summary interface
export interface PayrollBatchResult {
  results: PayrollResult[];
  employeeCount: number;
  totalBasicSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  totalNetSalary: number;
}
