export type PayrollComponentType = "EARNING" | "DEDUCTION";
export type CalculationType = "FIXE" | "POURCENTAGE_BRUT" | "POURCENTAGE_BASE" | "POURCENTAGE_IMPOSABLE" | "MANUEL" | "QUANTITE_TAUX" | "FORMULE";
export interface PayrollComponentInput {
    _id?: string;
    name: string;
    displayName?: string;
    displayOrder: number;
    type: PayrollComponentType;
    calculationType: CalculationType;
    calculationBase: "BASE_SALARY" | "GROSS_SALARY" | "TAXABLE_SALARY" | "TOTAL_EARNINGS" | "TOTAL_DEDUCTIONS" | "NET_SALARY" | null;
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
export interface PayrollResult {
    _id?: string;
    employeeId: string;
    generatedBy: string;
    month: number;
    year: number;
    earnings: PayrollItem[];
    deductions: PayrollItem[];
    baseSalary: number;
    grossSalary: number;
    taxableSalary: number;
    totalEarnings: number;
    totalDeductions: number;
    status: "BROUILLON" | "VERIFICATION" | "APPROUVÉ" | "PAYÉ" | "ANNULÉ";
    netSalary: number;
}
export interface PayrollBatchResult {
    results: PayrollResult[];
    employeeCount: number;
    totalBasicSalary: number;
    totalEarnings: number;
    totalDeductions: number;
    totalNetSalary: number;
}
export default interface AdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "MANAGER" | "ADMIN";
}
//# sourceMappingURL=types.d.ts.map