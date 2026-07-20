const mongoose = require("mongoose");

const employeeDocumentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUsers",
      default: null,
    },

    documentType: {
      type: String,
      enum: ["EMPLOYMENT_CONTRACT", "NATIONAL_ID"],
      required: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },

    version: {
      type: Number,
      default: 1,
    },

    uploaded: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Number,
      default: 0,
    },

    needsUpload: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
employeeDocumentSchema.index({ employeeId: 1 });
employeeDocumentSchema.index({ documentType: 1 });
employeeDocumentSchema.index({ needsUpload: 1 });

module.exports = mongoose.model("EmployeesDocuments", employeeDocumentSchema);
