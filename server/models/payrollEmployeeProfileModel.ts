import { Schema, model } from "mongoose";

export interface PayrollEmployeeProfileDocument {
  _id: string;
  employeeId: string;
  componentId: string;
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
  calculationBase:
    | "BASE_SALARY"
    | "GROSS_SALARY"
    | "TAXABLE_SALARY"
    | "TOTAL_EARNINGS"
    | "TOTAL_DEDUCTIONS"
    | "NET_SALARY"
    | null;
  value: number;
  taxable: number;
  requiresHRApproval: number;
  enabled: number;
  isOverridden: number;
  synced: number;
  isDeleted: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollEmployeeProfileSchema = new Schema<PayrollEmployeeProfileDocument>(
  {
    _id: {
      type: String,
      required: true,
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
      required: true,
      trim: true,
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
      required: true,
    },

    calculationBase: {
      type: String,
      enum: [
        "BASIC_SALARY",
        "GROSS_SALARY",
        "TOTAL_EARNINGS",
        "TAXABLE_SALARY",
      ],
    },

    value: {
      type: Number,
      default: 0,
    },

    taxable: {
      type: Number,
    },

    requiresHRApproval: {
      type: Number,
      default: 0,
    },

    enabled: {
      type: Number,
      default: 1,
    },

    isOverridden: {
      type: Number,
      default: 0,
    },

    synced: {
      type: Number,
      default: 1,
    },

    isDeleted: {
      type: Number,
      default: 0,
    },

    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      required: true,
    },

    updatedAt: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// One payroll profile per employee/component pair
PayrollEmployeeProfileSchema.index(
  { employeeId: 1, componentId: 1 },
  { unique: true }
);

// Useful for payroll generation
PayrollEmployeeProfileSchema.index({
  employeeId: 1,
  enabled: 1,
});

// Useful during synchronization
PayrollEmployeeProfileSchema.index({
  synced: 1,
  isDeleted: 1,
});

const PayrollEmployeeProfile = model<PayrollEmployeeProfileDocument>(
  "PayrollEmployeeProfiles",
  PayrollEmployeeProfileSchema
);

export default PayrollEmployeeProfile;
