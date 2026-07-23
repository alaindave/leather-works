import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface CreatePayrollComponentDto {
  name: string;
  displayName: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  defaultValue: number;
  percentageOf?: string | null;
  isActive: number;
}
