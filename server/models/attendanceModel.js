const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  clockIn: { type: Date, required: true },
  clockOut: { type: Date },

  status: {
    type: String,
    enum: ["ponctuel", "retard", "absent", "congé"],
    required: true,
  },

  lateMinutes: { type: Number },
  lateNotes: { type: String },
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
