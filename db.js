const mongoose = require("mongoose");
const Employee = require("./models/employeeModel");

//Connect to the database
mongoose
  .connect("mongodb://localhost:27017/Afritan_database")
  .then(() => console.log("Connected to Afritan database"))
  .catch((e) => console.log("Unable to connected to the database", e.message));

//Add an employee
const addEmployee = async ({
  firstName,
  lastName,
  employeeID,
  dateBirth,
  role,
  department,
  salary,
  dateHired,
  telephone,
  address,
}) => {
  const employee = new Employee({
    firstName,
    lastName,
    employeeID,
    dateBirth,
    role,
    department,
    salary,
    dateHired,
    telephone,
    address,
  });

  try {
    return await employee.save();
  } catch (e) {
    return e.message;
  }
};

//Retrieve all employees
const getEmployees = async () => {
  try {
    return await Employee.find();
  } catch (e) {
    return e.message;
  }
};

//Retrieve an employee
const findEmployee = async (id) => {
  try {
    return await Employee.findById(id);
  } catch (e) {
    return e.message;
  }
};

//Delete an employee
const deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id);
};

module.exports = {
  addEmployee,
  getEmployees,
  findEmployee,
  deleteEmployee,
};
