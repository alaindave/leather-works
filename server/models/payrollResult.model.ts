import { Schema, model } from "mongoose";
import { PayrollItemDocument } from "./payrollItem.model.js";

export interface PayrollResultDocument {
  _id: string;
  payrollRunId: string;
  employeeId: string;
  month: number;
  year: number;
  firstName?: string;
  lastName?: string;
  department?: string;
  baseSalary: number;
  grossSalary: number;
  earnings: PayrollItemDocument[];
  deductions: PayrollItemDocument[];
  totalEarnings: number;
  totalDeductions: number;
  status: "BROUILLON" | "VERIFICATION" | "APPROUVÉ" | "PAYÉ" | "ANNULÉ";
  notes?: string;
  cancelledAt?: string;
  verifiedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  netSalary: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: number;
}

const PayrollResultSchema = new Schema<PayrollResultDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    payrollRunId: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      ref: "Employees",
      required: true,
      index: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    baseSalary: {
      type: Number,
      required: true,
      default: 0,
    },

    grossSalary: {
      type: Number,
      required: true,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      required: true,
      default: 0,
    },

    totalDeductions: {
      type: Number,
      required: true,
      default: 0,
    },

    netSalary: {
      type: Number,
      required: true,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["BROUILLON", "VERIFICATION", "APPROUVÉ", "PAYÉ", "ANNULÉ"],
      default: "BROUILLON",
    },

    cancelledAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    approvedAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      required: true,
    },

    updatedAt: {
      type: Date,
      required: true,
    },

    isDeleted: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

PayrollResultSchema.index({
  employee: 1,
  "payrollPeriod.month": 1,
  "payrollPeriod.year": 1,
});

const PayrollResult = model<PayrollResultDocument>(
  "PayrollResults",
  PayrollResultSchema
);

export default PayrollResult;
