import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface CreatePayrollComponentDto {
  name: string;
  displayName: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  displayOrder: number;
  defaultValue: number;
  percentageOf?: string | null;
  requiresHRApproval?: number;
}
