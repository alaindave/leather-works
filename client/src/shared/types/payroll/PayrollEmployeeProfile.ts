import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface PayrollEmployeeProfile {
  _id?: string;
  employeeId?: string;
  componentId: string;
  name: string;
  displayName: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  percentageOf?: string | null;
  value: number | null;
  isOverridden?: number;
  enabled?: number;
  synced?: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string | null;
  isDeleted?: number;
}
