import { PayrollComponentType } from "./PayrollComponent.js";

export default interface PayrollItem {
  _id: string;
  employeeId: string;
  payrollResultId: string;
  componentId: string;
  name: string;
  displayName: string;
  type: PayrollComponentType;
  amount: number;
  // Fields for audit
  calculationMethod?: string; // "Fixed", "Percentage", "Formula"
  rate?: number; // e.g. 3 for 3%
  quantity?: number; // e.g. overtime hours
  taxable?: number;
  notes?: string; // "15 overtime hours × 5,000 BIF"
  synced: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
}
