import { PayrollEmployeeInput } from "./types.js";
export interface PayrollValidationResult {
    valid: boolean;
    message?: string;
    errors: string[];
}
export declare function validatePayroll(employee: PayrollEmployeeInput): PayrollValidationResult;
//# sourceMappingURL=validatePayroll.d.ts.map