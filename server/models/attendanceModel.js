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

  clockIn: { type: Date },
  clockOut: { type: Date },

  status: {
    type: String,
    enum: ["ponctuel", "retard", "absent", "congé"],
  },

  lateMinutes: { type: Number },
  totalHours: { type: Number },
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
