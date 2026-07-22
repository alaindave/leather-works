const express = require("express");
const router = express.Router();
const upload = require("../middleware/sync_upload");
const {
  syncEmployee,
  syncAttendance,
  syncLeave,
  syncTask,
  syncTaskComment,
  syncUserNotes,
  syncEmployeePhoto,
  syncEmployeeDocument,
} = require("../sync");
const Employee = require("../models/employeeModel");
const Attendance = require("../models/attendanceModel");
const Leave = require("../models/leaveModel");
const Task = require("../models/taskModel");
const { AdminUser } = require("../models/adminUserModel");

//Push sync
router.post(
  "/push",
  upload.fields([
    { name: "employees_photos" },
    { name: "employees_documents" },
  ]),
  async (req, res) => {
    try {
      const items = JSON.parse(req.body.items);

      console.log("REQ FILES:", req.files);

      const photoFiles = req.files?.employees_photos || [];

      const documentFiles = req.files?.employees_documents || [];

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

            case "task":
              await syncTask(operation, data);
              break;

            case "task_comment":
              await syncTaskComment(operation, data);
              break;

            case "user_notes":
              await syncUserNotes(data);
              break;

            case "employee_photo": {
              const file = photoFiles.find(
                (f) => f.originalname === data.photo_filename
              );

              await syncEmployeePhoto(data, file);
              break;
            }

            case "employee_document": {
              const file = documentFiles.find(
                (f) => f.originalname === data.fileName
              );

              await syncEmployeeDocument(operation, data, file);
              break;
            }

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
  }
);

//Pull sync
router.get("/pull", async (req, res) => {
  try {
    const since = req.query.since;
    if (!since) {
      return res.status(400).send("Missing since parameter");
    }
    const date = new Date(since);
    const [adminUsers, employees, attendances, leaves, tasks] =
      await Promise.all([
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

        Task.find({
          updatedAt: { $gt: date },
        }).lean(),
      ]);
    return res.send({
      success: true,
      adminUsers,
      employees,
      attendances,
      leaves,
      tasks,
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
