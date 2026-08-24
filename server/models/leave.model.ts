import { Schema, model } from "mongoose";

export interface LeaveDocument {
  _id: string;
  employeeId: string;
  submittedAt: Date;
  submittedMonth: string;
  startDate: string;
  endDate: string;
  subject: string;
  notes: string;
  status: "ATTENTE_APPROBATION" | "APPROUVÉ" | "REFUSÉ" | "ANNULÉ";
  version: {
    type: Number;
    required: true;
    default: 0;
  };
  createdAt: Date;
  updatedAt: Date;
  isDeleted: number;
}

const leaveSchema = new Schema<LeaveDocument>(
  {
    _id: {
      type: String,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
    },

    submittedAt: {
      type: Date,
      required: true,
    },

    submittedMonth: {
      type: String,
      required: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["ATTENTE_APPROBATION", "APPROUVÉ", "REFUSÉ", "ANNULÉ"],
      default: "ATTENTE_APPROBATION",
    },

    version: {
      type: Number,
      required: true,
      default: 0,
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
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Leave = model<LeaveDocument>("Leaves", leaveSchema);

export default Leave;
