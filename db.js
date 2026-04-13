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
    const result = await employee.save();
    console.log("Saved employee", result);
    return result;
  } catch (e) {
    console.log("unable to save employee", e.message);
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

module.exports = { addEmployee, getEmployees };
