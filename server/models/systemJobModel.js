const mongoose = require("mongoose");

const systemJobSchema = new mongoose.Schema({
  job: {
    type: String,
    required: true,
    unique: true,
  },

  lastRun: {
    type: Date,
    default: null,
  },

  status: {
    type: String,
    enum: ["success", "failed", "running"],
    default: "running",
  },

  message: {
    type: String,
    default: "",
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SystemJob", systemJobSchema);
