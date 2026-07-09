const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  _id: { type: String, required: true },

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

  clockIn: { type: Date },
  clockOut: { type: Date },

  status: {
    type: String,
    enum: ["PONCTUEL", "RETARD", "ABSENT"],
    required: true,
  },

  lateMinutes: { type: Number },
  lateNotes: { type: String },
  isDeleted: { type: Number, default: 0, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
