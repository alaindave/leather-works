const mongoose = require("mongoose");

const dailyAttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  clockIn: { type: Date },
  clockOut: { type: Date },

  status: {
    type: String,
    enum: ["ponctuel", "retard"],
  },

  lateMinutes: { type: Number },

  totalHours: { type: Number },
  notes: String,
});

dailyAttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
const DailyAttendance = mongoose.model(
  "DailyAttendance",
  dailyAttendanceSchema
);
module.exports = DailyAttendance;
