const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
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

  notes: String,
});

leaveSchema.index({ employee: 1 }, { unique: true });

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
