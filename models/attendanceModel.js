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

  clockIn: { type: String },
  clockOut: { type: String },

  status: {
    type: String,
    enum: ["present", "absent"],
    default: "present",
  },

  notes: String,
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
