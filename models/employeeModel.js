const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  employeeID: { type: String, required: true },
  dateBirth: { type: String, required: true },
  role: { type: String, required: true },
  dateHired: { type: String, required: true },
  department: { type: String, required: true },
  telephone: { type: Number, required: true },
  address: { type: String, required: true },
  salary: { type: Number, required: true },
  conge: { type: Object },
});

const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
