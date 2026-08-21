import mongoose, { Document, Schema } from "mongoose";

export interface PayrollSettings extends Document {
  _id: string;
  currency: string;
  workingDays: number;
  workingHours: number;
  paymentDay: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: number;
}

const PayrollSettingsSchema = new Schema<PayrollSettings>({
  _id: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    default: "FBU",
  },
  workingDays: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
    default: 25,
  },
  workingHours: {
    type: Number,
    required: true,
    min: 1,
    max: 24,
    default: 8,
  },
  paymentDay: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
    default: 30,
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
    required: true,
    default: 0,
  },
});

PayrollSettingsSchema.index({
  isDeleted: 1,
});

PayrollSettingsSchema.index({
  synced: 1,
});

const PayrollSettings = mongoose.model<PayrollSettings>(
  "PayrollSettings",
  PayrollSettingsSchema
);

export default PayrollSettings;
