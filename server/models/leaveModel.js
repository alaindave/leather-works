const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  employeeId: {
    type: String,
    ref: "Employees",
    required: true,
  },

  submittedAt: {
    type: Date,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
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
    enum: [`En attente d'approbation`, "Approuvé", "Refusé"],
    default: `En attente d'approbation`,
  },
});

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
