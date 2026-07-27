import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface CreatePayrollProfileDto {
  name: string;
  displayName: string;
  componentId?: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  value: number | null;
  percentageOf?: string | null;
}
