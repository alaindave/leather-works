const express = require("express");
const router = express.Router();
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
    if (!employees) return res.status(404).send("no employees found");
    console.log("List of employees:", employees);
    res.status(200).send(employees);
  } catch (e) {
    console.log("Unable to retrieve employees.Error:", e.message);
  }
});

//Add an employee
router.post("/", async (req, res) => {
  console.log("Data received from client", req.body);
  const result = await addEmployee(req.body);
  console.log("result:", result);
  res.send(result);
});

//Update an employee
router.put("/:_id", async (req, res) => {
  try {
    const employee = await getEmployee(req.params._id);
    if (!employee) res.status(404).send("No employee found with the given ID.");
    console.log("employee to update", employee);
    console.log("info to modify", req.body);

    const updatedEmployee = await updateEmployee(req.params._id, req.body);
    res.status(200).send(updatedEmployee);
    console.log("results", updatedEmployee);
  } catch (e) {
    console.log("This is the error", e.message);
    res.status(500).send("Unable to update user", e.message);
  }
});

//Delete an employee
router.delete("/:_id", async (req, res) => {
  const employee = await getEmployee(req.params._id);
  if (!employee) res.status(404).send("No employee found with the given ID.");
  const result = await deleteEmployee(req.params._id);
  res.status(204).send(result);
});

module.exports = router;
