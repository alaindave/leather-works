import mongoose, { Schema, Document } from "mongoose";

export interface CompanyDocument extends Document {
  companyId: string;
  name: string;
  legalName: string | null;
  signUpCode: string;
  logoPath: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  serverVersion: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: number;
}

const CompanySchema = new Schema<CompanyDocument>(
  {
    companyId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    legalName: {
      type: String,
      default: null,
      trim: true,
    },
    signUpCode: {
      type: String,
      required: true,
    },
    logoPath: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: null,
      trim: true,
    },

    website: {
      type: String,
      default: null,
      trim: true,
    },

    address: {
      type: String,
      default: null,
      trim: true,
    },

    city: {
      type: String,
      default: null,
      trim: true,
    },

    country: {
      type: String,
      default: null,
      trim: true,
    },

    createdAt: {
      type: String,
      required: true,
    },

    updatedAt: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Number,
      required: true,
      default: 0,
      enum: [0, 1],
    },
  },
  {
    _id: false,
    versionKey: false,
    collection: "companies",
  }
);

export default mongoose.model<CompanyDocument>("Company", CompanySchema);
