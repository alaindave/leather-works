export type PayrollComponentType = "EARNING" | "DEDUCTION";

export type PayrollCalculationType = "FIXE" | "POURCENTAGE" | "MANUEL";

export default interface PayrollComponent {
  _id: string;
  name: string;
  displayName: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  defaultValue: number;
  percentageOf?: string | null;
  enabled: number;
  isSystem: number;
  synced: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
  isDeleted: number;
}
