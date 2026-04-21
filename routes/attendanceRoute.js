const express = require("express");
const router = express.Router();
const { getEmployee, addAttendance, getAttendance } = require("../db");

//Get all attendance
router.get("/", async (req, res) => {
  try {
    const attendances = await getAttendance();
    if (!attendances) return res.status(404).send("no attendances found");
    console.log("Retrieved attendances:", attendances);
    res.status(200).send(attendances);
  } catch (e) {
    console.log("Unable to retrieve attendances.Error:", e.message);
  }
});

//Add attendance
router.post("/:_id", async (req, res) => {
  try {
    const employee = await getEmployee(req.params._id);
    if (!employee) res.status(404).send("No employee found with the given ID.");
    console.log("Employee to attend:", employee);
    const date = new Date().toLocaleDateString();
    const clockIn = new Date().toLocaleTimeString();
    console.log("current date", date);
    console.log("current time", clockIn);

    const attendanceReport = await addAttendance(req.params._id, date, clockIn);
    res.status(200).send(attendanceReport);
    console.log("Employee attendance success:", attendanceReport);
  } catch (e) {
    console.log("This is the attendance error", e.message);
    res.status(500).send("Unable to update attendance", e.message);
  }
});

module.exports = router;
