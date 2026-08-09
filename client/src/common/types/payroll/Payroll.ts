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
  payrollRunId?: string;
  month: number;
  year: number;
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  baseSalary: number;
  grossSalary: number;
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
  isDeleted?: string;
}

export type PayrollComponentType = "EARNING" | "DEDUCTION";

export type CalculationType =
  | "FIXE"
  | "POURCENTAGE_BRUT"
  | "POURCENTAGE_BASE"
  | "POURCENTAGE_IMPOSABLE"
  | "MANUEL"
  | "QUANTITE_TAUX"
  | "FORMULE";

export interface PayrollComponentInput {
  _id?: string;
  name: string;
  displayName?: string;
  displayOrder: number;
  type: PayrollComponentType;
  calculationType: CalculationType;
  calculationBase:
    | "BASE_SALARY"
    | "GROSS_SALARY"
    | "TAXABLE_SALARY"
    | "TOTAL_EARNINGS"
    | "TOTAL_DEDUCTIONS"
    | "NET_SALARY"
    | null;
  value?: number | null;
  quantity?: number | null;
  rate?: number | null;
  formula?: string | null;
  taxable?: number;
  enabled: number;
}

export interface PayrollEmployeeInput {
  employeeId: string;
  baseSalary: number;
  components: PayrollComponentInput[];
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
