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
    componentId?: string;
    name: string;
    type: PayrollComponentType;
    amount: number;
}
export interface PayrollResult {
    employeeId: string;
    generatedBy: string;
    earnings: PayrollItem[];
    deductions: PayrollItem[];
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
}
export default interface AdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "manager" | "admin";
}
//# sourceMappingURL=types.d.ts.map