import express, { Request, Response } from "express";

import upload from "../middlewares/sync_upload.js";

import {
  syncEmployee,
  syncAttendance,
  syncAttendanceDailyCheck,
  syncLeave,
  syncTask,
  syncTaskComment,
  syncUserNotes,
  syncEmployeePhoto,
  syncEmployeeDocument,
  syncPayrollComponent,
  syncPayrollProfile,
  SyncOperation,
  syncPayrollRun,
  syncPayrollResult,
  syncPayrollItem,
  syncPayrollSettings,
} from "../sync.js";

import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";
import Task from "../models/task.model.js";
import AdminUser from "../models/adminUser.model.js";
import EmployeeDocuments from "../models/employeesDocuments.model.js";
import PayrollComponent from "../models/payrollComponent.model.js";
import PayrollEmployeeProfile from "../models/payrollEmployeeProfile.model.js";
import PayrollResult from "../models/payrollResult.model.js";
import PayrollItem from "../models/payrollItem.model.js";
import PayrollRun from "../models/payrollRun.model.js";
import PayrollSettings from "../models/payrollSettings.model.js";
import AttendanceDailyCheck from "../models/attendanceDailyCheck.model.js";

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
  entity?: string;
  afterVersion?: string;
  limit?: string;
}

// ============================================================
// PUSH SYNC
// ============================================================

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
            case "employee": {
              const result = await syncEmployee(operation, data);

              console.log(
                `EMPLOYEE ${data._id} SERVER VERSION:`,
                result.serverVersion
              );

              break;
            }

            case "attendance":
              await syncAttendance(operation, data);
              break;

            case "attendance_daily_check":
              await syncAttendanceDailyCheck(operation, data);
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

            case "payroll_settings":
              await syncPayrollSettings(operation, data);
              break;

            case "payroll_component":
              await syncPayrollComponent(operation, data);
              break;

            case "payroll_profile":
              await syncPayrollProfile(operation, data);
              break;

            case "payroll_run":
              await syncPayrollRun(operation, data);
              break;

            case "payroll_result":
              await syncPayrollResult(operation, data);
              break;

            case "payroll_item":
              await syncPayrollItem(operation, data);
              break;

            default:
              console.warn(`UNKNOWN SYNC ENTITY: ${entity}`);

              continue;
          }

          // Only mark the queue item as synced AFTER
          // the entity sync succeeds.
          synced.push(queueId);
        } catch (error) {
          console.error(`PUSH FAILED FOR ${entity}`, error);
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

// ============================================================
// PULL SYNC
// ============================================================

router.get(
  "/pull",
  async (req: Request<{}, {}, {}, PullQuery>, res: Response) => {
    try {
      const { entity, afterVersion = "0", limit = "500", since } = req.query;

      // ======================================================
      // NEW VERSION-BASED EMPLOYEE SYNC
      // ======================================================

      if (entity === "employee") {
        const version = Number(afterVersion);
        const max = Number(limit);

        if (!Number.isInteger(version) || version < 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid afterVersion parameter",
          });
        }

        if (!Number.isInteger(max) || max <= 0 || max > 1000) {
          return res.status(400).json({
            success: false,
            message: "Invalid limit. Must be between 1 and 1000.",
          });
        }

        const employees = await Employee.find({
          serverVersion: {
            $gt: version,
          },
        })
          .sort({
            serverVersion: 1,
          })
          .limit(max)
          .lean();

        const nextVersion =
          employees.length > 0
            ? employees[employees.length - 1].serverVersion
            : version;

        // Check whether there are more employee
        // changes waiting after this batch.
        const moreChanges = await Employee.exists({
          serverVersion: {
            $gt: nextVersion,
          },
        });

        console.log("EMPLOYEE VERSION PULL:", {
          afterVersion: version,
          nextVersion,
          count: employees.length,
          hasMore: Boolean(moreChanges),
        });

        return res.json({
          success: true,
          entity: "employee",
          items: employees,
          nextVersion,
          hasMore: Boolean(moreChanges),
          serverTime: new Date().toISOString(),
        });
      }

      // ======================================================
      // LEGACY DATE-BASED SYNC
      //
      // Keep this temporarily while we migrate each entity.
      // ======================================================

      if (!since) {
        return res.status(400).json({
          success: false,
          message: "Missing since parameter",
        });
      }

      const date = new Date(since);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid since parameter",
        });
      }

      const [
        adminUsers,
        employeesDocuments,
        attendances,
        attendanceDailyCheck,
        leaves,
        tasks,
        payrollSettings,
        payrollComponents,
        payrollEmployeeProfiles,
        payrollRuns,
        payrollResults,
        payrollItems,
      ] = await Promise.all([
        AdminUser.find({
          updatedAt: { $gt: date },
        })
          .select("-password -notes")
          .lean(),

        EmployeeDocuments.find({
          updatedAt: { $gt: date },
        }).lean(),

        Attendance.find({
          updatedAt: { $gt: date },
        }).lean(),

        AttendanceDailyCheck.find({
          updatedAt: { $gt: date },
        }).lean(),

        Leave.find({
          updatedAt: { $gt: date },
        }).lean(),

        Task.find({
          updatedAt: { $gt: date },
        }).lean(),

        PayrollSettings.findOne({
          updatedAt: { $gt: date },
        }).lean(),

        PayrollComponent.find({
          updatedAt: { $gt: date },
        }).lean(),

        PayrollEmployeeProfile.find({
          updatedAt: { $gt: date },
        }).lean(),

        PayrollRun.find({
          updatedAt: { $gt: date },
        }).lean(),

        PayrollResult.find({
          updatedAt: { $gt: date },
        }).lean(),

        PayrollItem.find({
          updatedAt: { $gt: date },
        }).lean(),
      ]);

      console.log(
        "RETRIEVED ATTENDANCE DAILY CHECK TO SEND TO CLIENT",
        attendanceDailyCheck
      );

      return res.json({
        success: true,

        // Employee is intentionally NOT included here.
        // Employee now uses version-based syncing.

        adminUsers,
        employeesDocuments,
        attendances,
        attendanceDailyCheck,
        leaves,
        tasks,
        payrollSettings,
        payrollComponents,
        payrollEmployeeProfiles,
        payrollRuns,
        payrollResults,
        payrollItems,

        serverTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Pull sync failed",
      });
    }
  }
);

export default router;
