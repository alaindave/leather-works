const mongoose = require("mongoose");

const employeeDocumentSchema = new mongoose.Schema({
  _id: { type: String, required: true },

  employeeId: {
    type: String,
    ref: "Employees",
    required: true,
    index: true,
  },

  uploadedBy: {
    type: String,
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

  storagePath: {
    type: String,
    default: null,
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

  isDeleted: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

// Indexes
employeeDocumentSchema.index({ employeeId: 1 });
employeeDocumentSchema.index({ documentType: 1 });
employeeDocumentSchema.index({ needsUpload: 1 });

const EmployeesDocuments = mongoose.model(
  "EmployeesDocuments",
  employeeDocumentSchema
);

module.exports = EmployeesDocuments;
