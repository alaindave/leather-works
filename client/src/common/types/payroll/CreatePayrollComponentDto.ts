import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface CreatePayrollComponentDto {
  name: string;
  displayName: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  calculationBase:
    | "BASE_SALARY"
    | "GROSS_SALARY"
    | "TAXABLE_SALARY"
    | "TOTAL_EARNINGS"
    | "TOTAL_DEDUCTIONS"
    | "NET_SALARY"
    | null;
  displayOrder: number;
  defaultValue: number;
  requiresHRApproval?: number;
  taxable?: number;
}
