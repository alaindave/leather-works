const express = require("express");
const router = express.Router();
const Employee = require("../models/employeeModel");
const mongoose = require("mongoose");

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

//get all employees
router.get("/", async (req, res, next) => {
  try {
    const employees = await Employee.find();
    if (!employees) return res.status(404).send("no employees found");
    console.log("list of employees:", employees);
    res.status(200).send(employees);
  } catch (e) {
    res.status(500).send("Unable to retrieve employees.");
    console.log("Unable to retrieve employees", e);
  }
});

module.exports = router;
