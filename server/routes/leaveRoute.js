const express = require("express");
const router = express.Router();

const {
  getEmployee,
  addLeave,
  getLeavesByMonth,
  getLeaveByID,
  getPendingLeaves,
  editLeave,
  deleteLeave,
} = require("../db");

const sendLeaveRequestEmail = require("../utils/sendLeaveRequestEmail");

///Get leaves by submission month
router.get("/", async (req, res) => {
  console.log(
    `Fetch leaves for month:${req.query.month} and year: ${req.query.year}`
  );

  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).send("The month and year are required");
    }

    const leaves = await getLeavesByMonth(month, year);
    console.log("Fetched leaves by month:", leaves);
    res.send(leaves);
  } catch (error) {
    console.error("An error occured while retrieving leaves by month: ", error);
    res.status(500).send("Server error");
  }
});

//Add leave
router.post("/:employeeId", async (req, res) => {
  try {
    const employee = await getEmployee(req.params.employeeId);
    console.log("Employee submitting leave:", employee);
    if (!employee) {
      return res.status(404).send("No employee found with the given ID.");
    }
    let pendingLeaves = await getPendingLeaves(req.params.employeeId);
    console.log("Pending leaves found in db: ", pendingLeaves);
    if (pendingLeaves.length !== 0) {
      return res
        .status(400)
        .send("There is a pending leave request for this employee!");
    }

    const { startDate, endDate, notes, subject } = req.body;
    leave = await addLeave(
      req.params.employeeId,
      startDate,
      endDate,
      subject,
      notes
    );
    console.log("Employee leave success:", leave);
    // Send email notification
    try {
      const emailResults = await sendLeaveRequestEmail({
        employeeName: `${employee.firstName} ${employee.lastName}`,
        startDate,
        endDate,
        subject,
        notes,
      });

      console.log("Leave email result: ", emailResults);
    } catch (emailError) {
      console.error("Error sending leave email:", emailError);
    }
    return res.status(200).send(leave);
  } catch (error) {
    console.error("Unable to save leave:", error);
    return res.status(500).send(error);
  }
});
//Edit leave
router.put("/:leaveId", async (req, res) => {
  try {
    const leave = await getLeaveByID(req.params.leaveId);
    if (!leave) res.status(404).send("No leave found with the given ID.");
    console.log("Leave to edit:", leave);

    const leaveEdit = await editLeave(req.params.leaveId, req.body);
    res.status(200).send(leaveEdit);
    console.log("Leave edit success:", leaveEdit);
  } catch (error) {
    console.error("Leave edit error:", error);
    res.status(500).send("Unable to edit leave", error);
  }
});

//Delete leave
router.delete("/:leaveId", async (req, res) => {
  try {
    const leave = await getLeaveByID(req.params.leaveId);
    if (!leave) res.status(404).send("No leave found with the given ID.");
    console.log("Leave to delete:", leave);

    const leaveDeleted = await deleteLeave(req.params.leaveId);
    res.status(200).send(leaveDeleted);
    console.log("Leave delete success:", leaveDeleted);
  } catch (error) {
    console.error("Deletion request to database failed: ", error);
    res.status(500).send("Leave deletion error: ", error);
  }
});

module.exports = router;
