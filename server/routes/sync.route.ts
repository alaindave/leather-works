import express, { Request, Response } from "express";

import upload from "../middlewares/sync_upload.js";

import {
  syncEmployee,
  syncAttendance,
  syncLeave,
  syncTask,
  syncTaskComment,
  syncUserNotes,
  syncEmployeePhoto,
  syncEmployeeDocument,
  syncPayrollComponent,
  syncPayrollProfile,
  SyncOperation,
} from "../sync.js";

import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModel.js";
import Leave from "../models/leaveModel.js";
import Task from "../models/taskModel.js";
import AdminUser from "../models/adminUserModel.js";
import EmployeeDocuments from "../models/employeesDocumentsModel.js";
import PayrollComponent from "../models/payrollComponentModel.js";

const router = express.Router();

interface PushSyncRequest {
  items: string;
}

interface SyncItem {
  queueId: string;
  entity: string;
  operation: SyncOperation;
  data: any;
}

interface PullQuery {
  since?: string;
}

// Push sync
router.post(
  "/push",
  upload.fields([
    { name: "employees_photos" },
    { name: "employees_documents" },
  ]),
  async (req: Request<{}, {}, PushSyncRequest>, res: Response) => {
    try {
      const items: SyncItem[] = JSON.parse(req.body.items);

      console.log("REQ FILES:", req.files);

      const files = req.files as
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | undefined;

      const photoFiles = files?.employees_photos || [];

      const documentFiles = files?.employees_documents || [];

      const synced: string[] = [];

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

            case "payroll_component":
              await syncPayrollComponent(operation, data);
              break;

            case "payroll_profile":
              await syncPayrollProfile(operation, data);
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
  }
);

// Pull sync
router.get(
  "/pull",
  async (req: Request<{}, {}, {}, PullQuery>, res: Response) => {
    try {
      const { since } = req.query;

      if (!since) {
        return res.status(400).send("Missing since parameter");
      }

      const date = new Date(since);

      const [
        adminUsers,
        employees,
        employeesDocuments,
        attendances,
        leaves,
        tasks,
        payrollComponents,
      ] = await Promise.all([
        AdminUser.find({
          updatedAt: { $gt: date },
        })
          .select("-password -notes")
          .lean(),

        Employee.find({
          updatedAt: { $gt: date },
        }).lean(),

        EmployeeDocuments.find({
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

        PayrollComponent.find({
          updatedAt: { $gt: date },
        }).lean(),
      ]);

      return res.send({
        success: true,
        adminUsers,
        employees,
        employeesDocuments,
        attendances,
        leaves,
        tasks,
        payrollComponents,
        serverTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send({
        success: false,
        message: "Pull sync failed",
      });
    }
  }
);

export default router;
