export type PayrollComponentType = "EARNING" | "DEDUCTION";

export type PayrollCalculationType = "FIXE" | "POURCENTAGE" | "MANUEL";

export default interface PayrollComponent {
  _id: string;
  name: string;
  displayName: string;
  type: PayrollComponentType;
  calculationType: PayrollCalculationType;
  defaultValue?: number | null;
  displayOrder: number;
  percentageOf?:
    | "BASIC_SALARY"
    | "GROSS_SALARY"
    | "TOTAL_EARNINGS"
    | "TAXABLE_AMOUNT";
  requiresHRApproval: number;
  enabled: number;
  isSystem: number;
  synced: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
  isDeleted: number;
}
