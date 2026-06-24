const express = require("express");
const router = express.Router();
const { syncEmployee, syncAttendance, syncLeave } = require("../sync");
const Employee = require("../models/employeeModel");
const Attendance = require("../models/attendanceModel");
const Leave = require("../models/leaveModel");
const { AdminUser } = require("../models/adminUserModel");

//Push sync
router.post("/push", async (req, res) => {
  try {
    const { items } = req.body;
    const synced = [];
    for (const item of items) {
      const { queueId, entity, operation, data } = item;

      try {
        switch (entity) {
          case "employee":
            await syncEmployee(operation, data);
            break;

          case "attendance":
            await syncAttendance(operation, data);
            break;

          case "leave":
            await syncLeave(operation, data);
            break;

          default:
            continue;
        }
        synced.push(queueId);
      } catch (error) {
        console.error(`Push failed for ${entity}`, error);
      }
    }
    return res.json({
      success: true,
      synced,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Push sync failed",
    });
  }
});

//Pull sync
router.get("/pull", async (req, res) => {
  try {
    const since = req.query.since;
    if (!since) {
      return res.status(400).send("Missing since parameter");
    }
    const date = new Date(since);
    const [taskRecipients, employees, attendances, leaves] = await Promise.all([
      AdminUser.find({
        updatedAt: { $gt: date },
      })
        .select("-password -notes")
        .lean(),

      Employee.find({
        updatedAt: { $gt: date },
      }).lean(),

      Attendance.find({
        updatedAt: { $gt: date },
      }).lean(),

      Leave.find({
        updatedAt: { $gt: date },
      }).lean(),
    ]);
    return res.send({
      success: true,
      employees,
      attendances,
      leaves,
      taskRecipients,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Pull sync failed",
    });
  }
});

module.exports = router;
