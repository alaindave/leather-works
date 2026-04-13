const express = require("express");
const router = express.Router();
const { getEmployees, addEmployee } = require("../db");

//Get all employees
router.get("/employees", async (req, res) => {
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

router.post("/employees", async (req, res) => {
  console.log("Data received from client", req.body);
  const result = await addEmployee(req.body);
  console.log("result:", result);
  res.send(result);
});

module.exports = router;
