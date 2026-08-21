import mongoose, { Schema, Model } from "mongoose";

export interface PayrollItemDocument {
  _id: string;
  payrollResultId: string;
  employeeId: string;
  componentId: string;
  name: string;
  displayName?: string;
  type: "EARNING" | "DEDUCTION";
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: number;
  taxable?: number;
}

const payrollItemSchema = new Schema<PayrollItemDocument>(
  {
    _id: {
      type: String,
      required: true,
    },

    payrollResultId: {
      type: String,
      required: true,
      ref: "PayrollResult",
      index: true,
    },

    employeeId: {
      type: String,
      required: true,
      index: true,
    },

    componentId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    displayName: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["EARNING", "DEDUCTION"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
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

    taxable: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

payrollItemSchema.index({
  payrollResultId: 1,
  componentId: 1,
});

const PayrollItem: Model<PayrollItemDocument> =
  mongoose.models.PayrollItem ||
  mongoose.model<PayrollItemDocument>(
    "PayrollItem",
    payrollItemSchema,
    "payroll_items"
  );

export default PayrollItem;
