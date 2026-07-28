import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface CreatePayrollProfileDto {
  name: string;
  displayName: string;
  displayOrder: number;
  componentId?: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  value: number | null;
  percentageOf?: string | null;
}
