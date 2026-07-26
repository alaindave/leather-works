import {
  PayrollCalculationType,
  PayrollComponentType,
} from "./PayrollComponent.js";

export default interface EmployeePayrollProfile {
  _id: string;
  employeeId: string;
  componentId: string;
  displayName: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  value: number | null;
  isOverridden: number;
  enabled: number;
  synced: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string | null;
  isDeleted: number;
}
