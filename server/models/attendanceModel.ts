import { Schema, model } from "mongoose";

export interface AttendanceDocument {
  _id: string;
  employeeId: string;
  date: string;
  source: "MANUAL" | "AUTOMATIC";
  clockIn?: Date;
  clockOut?: Date;
  status: "PONCTUEL" | "RETARD" | "ABSENT" | "CONGÉ";
  lateMinutes?: number;
  lateNotes?: string;
  isDeleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<AttendanceDocument>({
  _id: {
    type: String,
    required: true,
  },

  employeeId: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  source: {
    type: String,
    default: "MANUAL",
    enum: ["MANUAL", "AUTOMATIC"],
    required: true,
  },

  clockIn: {
    type: Date,
  },

  clockOut: {
    type: Date,
  },

  status: {
    type: String,
    enum: ["PONCTUEL", "RETARD", "ABSENT", "CONGÉ"],
    required: true,
  },

  lateMinutes: {
    type: Number,
  },

  lateNotes: {
    type: String,
  },

  isDeleted: {
    type: Number,
    default: 0,
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
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = model<AttendanceDocument>("Attendances", attendanceSchema);

export default Attendance;
