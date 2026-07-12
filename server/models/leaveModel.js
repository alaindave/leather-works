const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  _id: { type: String, required: true },

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
    enum: [`EN ATTENTE D''APPROBATION`, "APPROUVÉ", "REFUSÉ", "ANNULÉ"],
    default: `EN ATTENTE D''APPROBATION`,
  },
  isDeleted: { type: Number, default: 0, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
