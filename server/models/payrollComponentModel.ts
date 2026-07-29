import { Schema, model } from "mongoose";

export interface PayrollComponentDocument {
  name: string;
  displayName: string;
  type: "EARNING" | "DEDUCTION";
  calculationType: "FIXE" | "POURCENTAGE" | "MANUEL";
  defaultValue: number;
  displayOrder: number;
  isSystem: number;
  percentageOf: string | null;
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
    default: "MANUEL",
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
    default: null,
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
