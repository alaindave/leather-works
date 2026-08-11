import { Schema, model } from "mongoose";

export interface PayrollComponentDocument {
  _id: string;
  name: string;
  displayName: string;
  type: "EARNING" | "DEDUCTION";
  calculationType:
    | "FIXE"
    | "MANUEL"
    | "POURCENTAGE_BASE"
    | "POURCENTAGE_BRUT"
    | "POURCENTAGE_IMPOSABLE"
    | "FORMULE";
  defaultValue: number;
  taxable?: Number;
  displayOrder: number;
  isSystem: number;
  calculationBase:
    | "BASE_SALARY"
    | "GROSS_SALARY"
    | "TAXABLE_SALARY"
    | "TOTAL_EARNINGS"
    | "TOTAL_DEDUCTIONS"
    | "NET_SALARY"
    | null;
  requiresHRApproval: number | null;
  enabled: number;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt: Date;
  isDeleted: number;
}

const PayrollComponentSchema = new Schema<PayrollComponentDocument>({
  _id: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  displayName: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["EARNING", "DEDUCTION"],
    required: true,
  },

  calculationType: {
    type: String,
    enum: [
      "FIXE",
      "MANUEL",
      "POURCENTAGE_BASE",
      "POURCENTAGE_BRUT",
      "POURCENTAGE_IMPOSABLE",
      "FORMULE",
    ],
    default: "MANUEL",
  },
  calculationBase: {
    type: String,
    enum: ["BASIC_SALARY", "GROSS_SALARY", "TOTAL_EARNINGS", "TAXABLE_SALARY"],
  },
  defaultValue: {
    type: Number,
    default: 0,
  },

  taxable: {
    type: Number,
  },

  displayOrder: {
    type: Number,
    default: 1,
  },

  isSystem: {
    type: Number,
    default: 1,
  },

  requiresHRApproval: {
    type: Number,
    default: 0,
  },

  enabled: {
    type: Number,
    default: 1,
  },

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
  },

  lastSyncedAt: {
    type: Date,
    default: Date.now,
  },

  isDeleted: {
    type: Number,
    default: 0,
  },
});

const PayrollComponent = model<PayrollComponentDocument>(
  "PayrollComponents",
  PayrollComponentSchema
);

export default PayrollComponent;
