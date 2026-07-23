import { PayrollComponentType } from "./PayrollComponent.js";

export default interface PayrollItem {
  _id: string;
  payrollId: string;
  componentId: string;
  name: string;
  type: PayrollComponentType;
  amount: number;
  synced: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
}
