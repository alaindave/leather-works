import { Schema, model } from "mongoose";

export interface PayrollComponentDocument {
  name: string;
  displayName: string;
  type: "EARNING" | "DEDUCTION";
  calculationType: "FIXE" | "POURCENTAGE" | "MANUAL";
  defaultValue: number;
  displayOrder: number;
  isSystem: number;
  percentageOf:
    | "BASIC_SALARY"
    | "GROSS_SALARY"
    | "TOTAL_EARNINGS"
    | " TAXABLE_AMOUNT";
  requiresHRApproval: number | null;
  enabled: number;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt: Date;
  isDeleted: number;
}

const PayrollComponentSchema = new Schema<PayrollComponentDocument>({
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
    enum: ["FIXE", "POURCENTAGE", "MANUEL"],
    default: "FIXE",
  },

  defaultValue: {
    type: Number,
    default: 0,
  },

  displayOrder: {
    type: Number,
    default: 1,
  },

  isSystem: {
    type: Number,
    default: 1,
  },

  percentageOf: {
    type: String,
    enum: ["BASIC_SALARY", "GROSS_SALARY", "TOTAL_EARNINGS", "TAXABLE_AMOUNT"],
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
