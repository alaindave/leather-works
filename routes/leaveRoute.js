const express = require("express");
const router = express.Router();
const {
  getEmployee,
  addLeave,
  getAllLeave,
  getLeave,
  editLeave,
  deleteLeave,
} = require("../db");

//Get all leaves
router.get("/", async (req, res) => {
  try {
    const leaves = await getAllLeave();
    if (!leaves) return res.status(404).send("no leaves found");
    console.log("Retrieved leaves:", leaves);
    res.status(200).send(leaves);
  } catch (e) {
    console.log("Unable to retrieve leaves.Error:", e.message);
  }
});

//Add leave
router.post("/:employeeId", async (req, res) => {
  try {
    const employee = await getEmployee(req.params.employeeId);
    if (!employee) res.status(404).send("No employee found with the given ID.");
    console.log("Employee to leave:", employee);
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const notes = req.body.notes;

    const leaveReport = await addLeave(
      req.params.employeeId,
      startDate,
      endDate,
      notes
    );
    res.status(200).send(leaveReport);
    console.log("Employee leave success:", leaveReport);
  } catch (e) {
    console.log("This is the leave error", e.message);
    res.status(500).send("Unable to add leave", e.message);
  }
});

//Edit leave
router.put("/:leaveId", async (req, res) => {
  try {
    const leave = await getLeave(req.params.leaveId);
    if (!leave) res.status(404).send("No leave found with the given ID.");
    console.log("Leave to edit:", leave);

    const leaveEdit = await editLeave(req.params.leaveId, req.body);
    res.status(200).send(leaveEdit);
    console.log("Leave edit success:", leaveEdit);
  } catch (e) {
    console.log("Leave edit error:", e.message);
    res.status(500).send("Unable to edit leave", e.message);
  }
});

//Delete leave
router.delete("/:leaveId", async (req, res) => {
  try {
    const leave = await getLeave(req.params.leaveId);
    if (!leave) res.status(404).send("No leave found with the given ID.");
    console.log("Leave to delete:", leave);

    const leaveDeleted = await deleteLeave(req.params.leaveId);
    res.status(200).send(leaveDeleted);
    console.log("Leave delete success:", leaveDeleted);
  } catch (e) {
    console.log("Leave deletion error:", e.message);
    res.status(500).send("Unable to delete leave", e.message);
  }
});

module.exports = router;
