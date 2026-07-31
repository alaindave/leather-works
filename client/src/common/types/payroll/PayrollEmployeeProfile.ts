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
  percentageOf?:
    | "BASIC_SALARY"
    | "GROSS_SALARY"
    | "TOTAL_EARNINGS"
    | "TAXABLE_AMOUNT";
  value: number | null;
  isOverridden?: number;
  requiresHRApproval: number;
  enabled?: number;
  synced?: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string | null;
  isDeleted?: number;
}
