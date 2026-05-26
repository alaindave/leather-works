const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  employeeID: { type: String, required: true },
  dateBirth: { type: String, required: true },
  role: { type: String, required: true },
  dateHired: { type: String, required: true },
  department: {
    type: String,
    enum: ["Administration", "Atelier", "Usine", "Magasin", "Sentinelle"],
    required: true,
  },
  telephone: { type: String, required: true },
  address: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  relationship: { type: String, required: true },
  contactPhone: { type: String, required: true },
  salary: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "leave", "inactive"],
    default: "active",
    required: true,
  },
  remainingLeave: { type: Number, default: 20, required: true },
});

const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
