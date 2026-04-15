const express = require("express");
const router = express.Router();
const { getEmployees, addEmployee, deleteEmployee } = require("../db");

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

//Delete an employee
router.delete("/:_id", async (req, res) => {
  const result = await deleteEmployee(req.params._id);
  res.status(204).send(result);
});

module.exports = router;
