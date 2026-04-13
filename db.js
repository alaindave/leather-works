const mongoose = require("mongoose");
const Employee = require("./models/employeeModel");
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log("Unable to connected to the database", e.message));

// interface EmployeeType {
//   firstName: String;
//   lastName: String;
//   employeeID: Number;
//   dateBirth: String;
//   role: String;
//   department: String;
//   dateHired: String;
//   salary: Number;
//   telephone: Number;
//   address: String;
//   photo: String;
// }

const addEmployee = async () => {
  const employee = new Employee({
    firstName: "Chards",
    lastName: "Bedet",
    employeeID: "1784/267.982",
    dateBirth: "23 Mai 1998",
    role: "Superviseur",
    department: "Usine",
    salary: 30000,
    dateHired: "28 Octobre 1983",
    telephone: 785749244,
    address: "Q.Industriel",
    photo: "../assets/photos/Jeanne.jpeg",
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

addEmployee();
