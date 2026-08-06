import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface CreatePayrollProfileDto {
  name: string;
  displayName: string;
  displayOrder?: number;
  componentId?: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  value: number | null;
  calculationBase?:
    | "BASE_SALARY"
    | "GROSS_SALARY"
    | "TAXABLE_SALARY"
    | "TOTAL_EARNINGS"
    | "TOTAL_DEDUCTIONS"
    | "NET_SALARY"
    | null;
  taxable?: number;
  requiresHRApproval?: number | null;
}
