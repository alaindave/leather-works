const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  matricule: { type: String, required: true },
  idNum: { type: String, required: true, default: "BDI/11/222" },
  dateBirth: { type: Date, required: true },
  dateHired: { type: Date, required: true },
  role: { type: String, required: true },
  department: {
    type: String,
    enum: ["Administration", "Atelier", "Usine", "Magasin", "Sentinelle"],
    required: true,
  },
  salary: { type: Number, required: true },
  remainingLeave: { type: Number, default: 20, required: true },
  status: {
    type: String,
    enum: ["ACTIF", "INACTIF"],
    default: "ACTIF",
    required: true,
  },
  telephone: { type: String, required: true },
  address: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  relationship: { type: String, required: true },
  contactPhone: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  isDeleted: { type: Number, default: 0, required: true },
  photo_filename: {
    type: String,
    default: null,
  },

  photo_path: {
    type: String,
    default: null,
  },
  photo_version: {
    type: Number,
    default: 0,
    required: true,
  },
  photo_hash: {
    type: String,
    default: null,
  },
  photo_mime_type: {
    type: String,
    enum: ["image/jpeg", "image/png", "image/webp", null],
    default: null,
  },
  photo_last_modified: {
    type: Date,
    default: null,
  },
});

const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
