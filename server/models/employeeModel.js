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
    enum: ["actif", "inactif"],
    default: "actif",
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
});

const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
