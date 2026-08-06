import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface PayrollEmployeeProfile {
  _id?: string;
  employeeId: string;
  componentId: string;
  name: string;
  displayName: string;
  displayOrder: number;
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
  value: number | null;
  taxable?: number;
  isOverridden?: number;
  requiresHRApproval?: number;
  enabled?: number;
  synced?: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string | null;
  isDeleted?: number;
}
