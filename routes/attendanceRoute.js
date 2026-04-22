const express = require("express");
const router = express.Router();
const {
  getEmployee,
  addAttendance,
  getAllAttendance,
  getAttendance,
  editAttendance,
  deleteAttendance,
} = require("../db");

//Get all attendance
router.get("/", async (req, res) => {
  try {
    const attendances = await getAllAttendance();
    if (!attendances) return res.status(404).send("no attendances found");
    console.log("Retrieved attendances:", attendances);
    res.status(200).send(attendances);
  } catch (e) {
    console.log("Unable to retrieve attendances.Error:", e.message);
  }
});

//Add attendance
router.post("/:employeeId", async (req, res) => {
  try {
    const employee = await getEmployee(req.params.employeeId);
    if (!employee) res.status(404).send("No employee found with the given ID.");
    console.log("Employee to attend:", employee);
    const date = new Date().toLocaleDateString();
    const clockIn = new Date().toLocaleTimeString();
    console.log("current date", date);
    console.log("current time", clockIn);

    const attendanceReport = await addAttendance(
      req.params.employeeId,
      date,
      clockIn
    );
    res.status(200).send(attendanceReport);
    console.log("Employee attendance success:", attendanceReport);
  } catch (e) {
    console.log("This is the attendance error", e.message);
    res.status(500).send("Unable to update attendance", e.message);
  }
});

//Edit attendance
router.put("/:attendanceId", async (req, res) => {
  try {
    const attendance = await getAttendance(req.params.attendanceId);
    if (!attendance)
      res.status(404).send("No attendance found with the given ID.");
    console.log("Attendance to edit:", attendance);

    const attendanceEdit = await editAttendance(
      req.params.attendanceId,
      req.body
    );
    res.status(200).send(attendanceEdit);
    console.log("Attendance edit success:", attendanceEdit);
  } catch (e) {
    console.log("Attendance edit error:", e.message);
    res.status(500).send("Unable to edit attendance", e.message);
  }
});

//Delete attendance
router.delete("/:attendanceId", async (req, res) => {
  try {
    const attendance = await getAttendance(req.params.attendanceId);
    if (!attendance)
      res.status(404).send("No attendance found with the given ID.");
    console.log("Attendance to delete:", attendance);

    const attendanceDeleted = await deleteAttendance(req.params.attendanceId);
    res.status(200).send(attendanceDeleted);
    console.log("Attendance delete success:", attendanceDeleted);
  } catch (e) {
    console.log("Attendance deletion error:", e.message);
    res.status(500).send("Unable to delete attendance", e.message);
  }
});

module.exports = router;
