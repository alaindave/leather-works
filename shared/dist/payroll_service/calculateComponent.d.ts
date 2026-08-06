import { PayrollComponentInput } from "./types.js";
export interface PayrollCalculationContext {
    baseSalary: number;
    grossSalary: number;
    taxableSalary: number;
    totalEarnings: number;
    totalDeductions: number;
    netSalary: number;
}
export declare function calculateComponent(component: PayrollComponentInput, context: PayrollCalculationContext): number;
//# sourceMappingURL=calculateComponent.d.ts.map