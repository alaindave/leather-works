const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  getEmployee,
  addAttendance,
  getAllAttendances,
  getAttendance,
  getAttendanceByDate,
  getAttendanceByEmployeeID,
  editAttendance,
  deleteAttendance,
} = require("../db");

//Add attendance
router.post("/:employeeId", async (req, res) => {
  try {
    const employee = await getEmployee(req.params.employeeId);
    if (!employee)
      return res.status(404).send("No employee found with the given ID.");
    const attendance = await getAttendanceByEmployeeID(req.params.employeeId);
    if (attendance)
      return res.status(404).send("The employee has already clocked in");
    console.log("Employee to attend:", employee);
    const date = new Date().toISOString().split("T")[0];
    console.log("current date", date);
    console.log("current time", req.body);
    const attendanceReport = await addAttendance(
      req.params.employeeId,
      date,
      req.body.clockIn
    );
    res.status(200).send(attendanceReport);
    console.log("Employee attendance success:", attendanceReport);
  } catch (error) {
    console.error("An error occured during attendance entry: ", error);
    res.status(500).send(error);
  }
});

//Get attendances by date
router.get("/", async (req, res) => {
  console.log("Date received:", req.query.date);
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).send("Date is required");
    }

    const attendances = await getAttendanceByDate(date);
    console.log("Fetched attendances by date:", attendances);
    res.send(attendances);
  } catch (error) {
    console.error(
      "An error occured while retrieving attendances by date: ",
      error
    );
    res.status(500).send("Server error");
  }
});

//Get daily attendance by employee ID
router.get("/:employeeId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.employeeId)) {
      return res.status(400).send("Invalid employee ID");
    }
    const attendance = await getAttendanceByEmployeeID(req.params.employeeId);
    if (!attendance)
      return res
        .status(404)
        .send("No attendance with the given employee ID found!");
    console.log("Retrieved attendance:", attendance);
    res.status(200).send(attendance);
  } catch (error) {
    console.error(
      "Unable to retrieve attendance by employee ID. Error:",
      error
    );
  }
});

//Edit attendance
router.put("/:attendanceId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.attendanceId)) {
      return res.status(400).send("Invalid attendance ID");
    }
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
    console.error("Attendance edit error:", e);
    res.status(500).send("Unable to edit attendance", e);
  }
});

//Delete attendance
router.delete("/:attendanceId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.attendanceId)) {
      return res.status(400).send("Invalid attendance ID");
    }
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
