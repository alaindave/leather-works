const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  employeeID: { type: String, required: true },
  dateBirth: { type: String, required: true },
  role: { type: String, required: true },
  dateHired: { type: String, required: true },
  department: { type: String, required: true },
  telephone: { type: String, required: true },
  address: { type: String, required: true },
  salary: { type: String, required: true },
  present: { type: Boolean, default: false, required: true },
  leave: { type: Boolean, default: false, required: true },
});

const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
