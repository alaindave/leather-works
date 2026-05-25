const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../db");

//Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await getEmployees();
    if (!employees) return res.status(404).send("No employees found");
    console.log("Employees fetched:", employees);
    res.status(200).send(employees);
  } catch (error) {
    console.error("Unable to retrieve employees. Error: ", error);
    res.status(500).send(error);
  }
});

//Add an employee
router.post("/", async (req, res) => {
  try {
    const employee = await addEmployee(req.body);
    console.log("Added employee:", employee);
    res.status(200).send(employee);
  } catch (error) {
    console.error("Unable to add the employee. Error: ", error);
    res.status(500).send(error);
  }
});

//Get an employee by ID
router.get("/:_id", async (req, res) => {
  console.log("ID of employee to fetch:", req.params._id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send("Invalid employee ID");
    }
    const employee = await getEmployee(req.params._id);
    if (!employee) res.status(404).send("No employee found with the given ID.");
    console.log("Fetched employee: ", employee);
    res.status(200).send(employee);
  } catch (error) {
    console.error("An error occured while fetching employee: ", error);
    res.status(500).send(error);
  }
});

//Update an employee
router.put("/:_id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send("Invalid employee ID");
    }
    const employee = await getEmployee(req.params._id);
    if (!employee) res.status(404).send("No employee found with the given ID.");
    console.log("employee to update", employee);
    console.log("info to modify", req.body);

    const updatedEmployee = await updateEmployee(req.params._id, req.body);
    res.status(200).send(updatedEmployee);
    console.log("Updated employee: ", updatedEmployee);
  } catch (error) {
    console.error("An error occured while updating the employee: ", error);
    res.status(500).send(error);
  }
});

//Delete an employee
router.delete("/:_id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send("Invalid employee ID");
    }
    const employee = await getEmployee(req.params._id);
    if (!employee) res.status(404).send("No employee found with the given ID.");
    const result = await deleteEmployee(req.params._id);
    res.status(204).send(result);
  } catch (error) {
    console.error("An error occured while deleting employee:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
