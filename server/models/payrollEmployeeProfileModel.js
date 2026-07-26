const mongoose = require("mongoose");

const EmployeePayrollProfileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
      index: true,
    },

    componentId: {
      type: String,
      required: true,
      index: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["EARNING", "DEDUCTION"],
      required: true,
    },

    calculationType: {
      type: String,
      enum: ["FIXE", "MANUEL", "POURCENTAGE"],
      required: true,
    },

    value: {
      type: Number,
      default: 0,
    },

    enabled: {
      type: Number,
      default: 1,
    },

    isOverridden: {
      type: Number,
      default: 0,
    },

    synced: {
      type: Number,
      default: 1,
    },

    isDeleted: {
      type: Number,
      default: 0,
    },

    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

// One payroll profile per employee/component pair
EmployeePayrollProfileSchema.index(
  { employeeId: 1, componentId: 1 },
  { unique: true }
);

// Useful for payroll generation
EmployeePayrollProfileSchema.index({
  employeeId: 1,
  enabled: 1,
});

// Useful during synchronization
EmployeePayrollProfileSchema.index({
  synced: 1,
  isDeleted: 1,
});

const EmployeePayrollProfile = mongoose.model(
  "EmployeePayrollProfile",
  EmployeePayrollProfileSchema
);
module.exports = EmployeePayrollProfile;
