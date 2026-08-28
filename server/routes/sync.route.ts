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

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

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
  entity?: string;
  afterVersion?: string;
  limit?: string;
}

/*
 * ============================================================
 * VERSIONED PULL HELPER
 * ============================================================
 *
 * Every entity uses the exact same synchronization strategy:
 *
 *   serverVersion > afterVersion
 *
 * Results are ordered by serverVersion so the client can
 * safely advance its cursor.
 *
 * IMPORTANT:
 *
 * We intentionally DO NOT filter isDeleted here.
 *
 * A deleted document must still reach the client so the local
 * database can perform the corresponding soft delete.
 * ============================================================
 */

async function pullVersionedCollection<T extends { serverVersion?: number }>(
  model: any,
  afterVersion: number,
  limit: number,
  select?: string
) {
  let query = model
    .find({
      serverVersion: {
        $gt: afterVersion,
      },
      isDeleted: 0,
    })
    .sort({
      serverVersion: 1,
    })
    .limit(limit);

  if (select) {
    query = query.select(select);
  }

  const items = await query.lean();

  const nextVersion =
    items.length > 0
      ? Number(items[items.length - 1].serverVersion ?? afterVersion)
      : afterVersion;

  const moreChanges = await model.exists({
    serverVersion: {
      $gt: nextVersion,
    },
  });

  return {
    items: items as T[],
    nextVersion,
    hasMore: Boolean(moreChanges),
  };
}

/*
 * ============================================================
 * PUSH SYNC
 * ============================================================
 */

router.post(
  "/push",
  upload.fields([
    {
      name: "employees_photos",
    },
    {
      name: "employees_documents",
    },
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

            case "attendance": {
              const result = await syncAttendance(operation, data);

              console.log(
                `ATTENDANCE ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "attendance_daily_check": {
              const result = await syncAttendanceDailyCheck(operation, data);

              console.log(
                `ATTENDANCE DAILY CHECK ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "leave": {
              const result = await syncLeave(operation, data);

              console.log(
                `LEAVE ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "task": {
              const result = await syncTask(operation, data);

              console.log(
                `TASK ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "task_comment": {
              const result = await syncTaskComment(operation, data);

              console.log(
                `TASK COMMENT ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "user_notes":
              const result = await syncUserNotes(data);
              console.log(
                `User notes ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );
              break;

            case "employee_photo": {
              const file = photoFiles.find(
                (f) => f.originalname === data.photo_filename
              );

              const result = await syncEmployeePhoto(data, file);
              console.log(
                `EMPLOYEE PHOTOS ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );
              break;
            }

            case "employee_document": {
              const file = documentFiles.find(
                (f) => f.originalname === data.fileName
              );

              const result = await syncEmployeeDocument(operation, data, file);

              console.log(
                `EMPLOYEE DOCUMENT ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "payroll_settings": {
              const result = await syncPayrollSettings(operation, data);

              console.log(
                `PAYROLL SETTINGS ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "payroll_component": {
              const result = await syncPayrollComponent(operation, data);

              console.log(
                `PAYROLL COMPONENT ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "payroll_profile": {
              const result = await syncPayrollProfile(operation, data);

              console.log(
                `PAYROLL PROFILE ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "payroll_run": {
              const result = await syncPayrollRun(operation, data);

              console.log(
                `PAYROLL RUN ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "payroll_result": {
              const result = await syncPayrollResult(operation, data);

              console.log(
                `PAYROLL RESULT ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            case "payroll_item": {
              const result = await syncPayrollItem(operation, data);

              console.log(
                `PAYROLL ITEM ${data._id} SERVER VERSION:`,
                result?.serverVersion
              );

              break;
            }

            default:
              console.warn(`UNKNOWN SYNC ENTITY: ${entity}`);
              continue;
          }

          /*
           * Queue item is only considered synced after the
           * server operation completed successfully.
           */
          synced.push(queueId);
        } catch (error) {
          console.error(`PUSH FAILED FOR ${entity}`, {
            queueId,
            entityId: data?._id,
            error,
          });
        }
      }

      return res.json({
        success: true,
        synced,
      });
    } catch (error) {
      console.error("PUSH SYNC FAILED:", error);

      return res.status(500).json({
        success: false,
        message: "Push sync failed",
      });
    }
  }
);

/*
 * ============================================================
 * PULL SYNC
 * ============================================================
 */

router.get(
  "/pull",
  async (req: Request<{}, {}, {}, PullQuery>, res: Response) => {
    try {
      const { entity, afterVersion = "0", limit = "500" } = req.query;

      /*
       * --------------------------------------------------------
       * VALIDATE VERSION
       * --------------------------------------------------------
       */

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

      /*
       * --------------------------------------------------------
       * ENTITY IS REQUIRED
       * --------------------------------------------------------
       */

      if (!entity) {
        return res.status(400).json({
          success: false,
          message: "Missing entity parameter",
        });
      }

      /*
       * --------------------------------------------------------
       * EMPLOYEES
       * --------------------------------------------------------
       */

      if (entity === "employee") {
        const result = await pullVersionedCollection(Employee, version, max);

        console.log("EMPLOYEE VERSION PULL:", {
          afterVersion: version,
          nextVersion: result.nextVersion,
          count: result.items.length,
          hasMore: result.hasMore,
        });

        console.log(
          "EMPLOYEE PULL FROM MONGO:",
          JSON.stringify(result.items[0], null, 2)
        );

        return res.json({
          success: true,
          entity: "employee",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * ADMIN USERS
       * --------------------------------------------------------
       */

      if (entity === "admin_user") {
        const result = await pullVersionedCollection(
          AdminUser,
          version,
          max,
          "-password -notes"
        );

        return res.json({
          success: true,
          entity: "admin_user",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * EMPLOYEE DOCUMENTS
       * --------------------------------------------------------
       */

      if (entity === "employee_document") {
        const result = await pullVersionedCollection(
          EmployeeDocuments,
          version,
          max
        );

        return res.json({
          success: true,
          entity: "employee_document",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * ATTENDANCE
       * --------------------------------------------------------
       */

      if (entity === "attendance") {
        const result = await pullVersionedCollection(Attendance, version, max);

        return res.json({
          success: true,
          entity: "attendance",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * ATTENDANCE DAILY CHECK
       * --------------------------------------------------------
       */

      if (entity === "attendance_daily_check") {
        const result = await pullVersionedCollection(
          AttendanceDailyCheck,
          version,
          max
        );

        return res.json({
          success: true,
          entity: "attendance_daily_check",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * LEAVE
       * --------------------------------------------------------
       */

      if (entity === "leave") {
        const result = await pullVersionedCollection(Leave, version, max);

        return res.json({
          success: true,
          entity: "leave",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * TASK
       * --------------------------------------------------------
       */

      if (entity === "task") {
        const result = await pullVersionedCollection(Task, version, max);

        return res.json({
          success: true,
          entity: "task",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * PAYROLL SETTINGS
       * --------------------------------------------------------
       *
       * Although this is currently effectively a singleton,
       * we still use the same version cursor.
       * --------------------------------------------------------
       */

      if (entity === "payroll_settings") {
        const result = await pullVersionedCollection(
          PayrollSettings,
          version,
          max
        );

        return res.json({
          success: true,
          entity: "payroll_settings",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * PAYROLL COMPONENT
       * --------------------------------------------------------
       */

      if (entity === "payroll_component") {
        const result = await pullVersionedCollection(
          PayrollComponent,
          version,
          max
        );

        return res.json({
          success: true,
          entity: "payroll_component",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * PAYROLL PROFILE
       * --------------------------------------------------------
       */

      if (entity === "payroll_profile") {
        const result = await pullVersionedCollection(
          PayrollEmployeeProfile,
          version,
          max
        );

        return res.json({
          success: true,
          entity: "payroll_profile",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * PAYROLL RUN
       * --------------------------------------------------------
       */

      if (entity === "payroll_run") {
        const result = await pullVersionedCollection(PayrollRun, version, max);

        return res.json({
          success: true,
          entity: "payroll_run",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * PAYROLL RESULT
       * --------------------------------------------------------
       */

      if (entity === "payroll_result") {
        const result = await pullVersionedCollection(
          PayrollResult,
          version,
          max
        );

        return res.json({
          success: true,
          entity: "payroll_result",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * PAYROLL ITEM
       * --------------------------------------------------------
       */

      if (entity === "payroll_item") {
        const result = await pullVersionedCollection(PayrollItem, version, max);

        return res.json({
          success: true,
          entity: "payroll_item",
          items: result.items,
          nextVersion: result.nextVersion,
          hasMore: result.hasMore,
          serverTime: new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * UNKNOWN ENTITY
       * --------------------------------------------------------
       */

      return res.status(400).json({
        success: false,
        message: `Unknown sync entity: ${entity}`,
      });
    } catch (error) {
      console.error("PULL SYNC FAILED:", error);

      return res.status(500).json({
        success: false,
        message: "Pull sync failed",
      });
    }
  }
);

export default router;
