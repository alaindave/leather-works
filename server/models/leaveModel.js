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

// leaveSchema.index({ employee: 1 }, { unique: true });

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
