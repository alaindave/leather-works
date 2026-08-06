export type PayrollComponentType = "EARNING" | "DEDUCTION";
export type CalculationType = "FIXE" | "POURCENTAGE" | "MANUEL";
export interface PayrollComponentInput {
    _id?: string;
    name: string;
    displayName?: string;
    displayOrder: number;
    type: PayrollComponentType;
    calculationType: CalculationType;
    value: number;
    percentageOf?: "BASE_SALARY" | "GROSS_SALARY";
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
    quantity?: number;
    notes?: string;
    synced?: number;
    isDeleted?: number;
    createdAt?: string;
    updatedAt?: string;
    lastSyncedAt?: string;
}
export interface PayrollResult {
    employeeId: string;
    generatedBy: string;
    month: number;
    year: number;
    earnings: PayrollItem[];
    deductions: PayrollItem[];
    baseSalary: number;
    grossSalary: number;
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