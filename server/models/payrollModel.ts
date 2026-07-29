import { Schema, model } from "mongoose";

export interface PayrollItemDocument {
  componentId: string;
  name: string;
  type: "EARNING" | "DEDUCTION";
  amount: number;
  isDeleted: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollDocument {
  employee: string;
  payrollPeriod: {
    month: number;
    year: number;
  };
  earnings: PayrollItemDocument[];
  deductions: PayrollItemDocument[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  notes: string;
  generatedBy?: string;
  status: "BROUILLON" | "APPROUVÉ" | "PAYÉ";
  isDeleted: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollItemSchema = new Schema<PayrollItemDocument>(
  {
    componentId: {
      type: String,
      ref: "PayrollComponent",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["EARNING", "DEDUCTION"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
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

const PayrollSchema = new Schema<PayrollDocument>({
  employee: {
    type: String,
    ref: "Employees",
    required: true,
    index: true,
  },

  payrollPeriod: {
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
  },

  earnings: {
    type: [PayrollItemSchema],
    default: [],
  },

  deductions: {
    type: [PayrollItemSchema],
    default: [],
  },

  grossSalary: {
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

  generatedBy: {
    type: String,
    ref: "AdminUsers",
  },

  status: {
    type: String,
    enum: ["BROUILLON", "APPROUVÉ", "PAYÉ"],
    default: "BROUILLON",
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
});

PayrollSchema.index({
  employee: 1,
  "payrollPeriod.month": 1,
  "payrollPeriod.year": 1,
});

const Payroll = model<PayrollDocument>("Payrolls", PayrollSchema);

export default Payroll;
