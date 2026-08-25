import axios from "axios";
import { app } from "electron";
import path from "path";
import { getEmployeeById } from "../../database/repositories/employees.repository.js";
import { setSetting } from "../../database/repositories/settings.repository.js";
import { upsertAdminUser } from "../../database/repositories/admin_users.repository.js";
import {
  markEmployeeSynced,
  upsertEmployee,
} from "../../database/repositories/employees.repository.js";
import {
  markAttendanceSynced,
  upsertAttendance,
} from "../../database/repositories/attendances.repository.js";
import {
  markLeaveSynced,
  upsertLeave,
} from "../../database/repositories/leaves.repository.js";
import Employee from "../../../common/types/Employee.js";
import Attendance from "../../../common/types/Attendance.js";
import Leave from "../../../common/types/Leave.js";
import AdminUser from "../../../common/types/AdminUser.js";
import Task from "../../../common/types/Task.js";
import PayrollComponent from "../../../common/types/payroll/PayrollComponent.js";
import {
  markTaskSynced,
  upsertTask,
} from "../../database/repositories/tasks.repository.js";
import { downloadEmployeePhoto } from "../../util/downloadEmployeePhoto.util.js";
import { updateEmployeePhotoMetadata } from "../../database/repositories/employees_photos.repository.js";
import { upsertTaskComment } from "../../database/repositories/tasks_comments.repository.js";
import {
  getEmployeeDocument,
  upsertEmployeeDocument,
  markEmployeeDocumentSynced,
} from "../../database/repositories/employees_documents.repository.js";
import { downloadEmployeeDocument } from "../../util/downloadEmployeeDocument.util.js";
import { EmployeeDocument } from "../../../common/types/EmployeeDocuments.js";
import {
  upsertPayrollComponent,
  markPayrollComponentSynced,
} from "../../database/repositories/payroll_components.repository.js";
import PayrollEmployeeProfile from "../../../common/types/payroll/PayrollEmployeeProfile.js";
import {
  markPayrollEmployeeProfileSynced,
  upsertEmployeePayrollProfile,
} from "../../database/repositories/payroll_employee_profile.repository.js";
import {
  PayrollResult,
  PayrollRun,
  PayrollItem,
} from "../../../common/types/payroll/Payroll.js";
import {
  markPayrollItemSynced,
  markPayrollResultSynced,
  markPayrollRunSynced,
  upsertPayrollItem,
  upsertPayrollResult,
  upsertPayrollRun,
} from "../../database/repositories/payroll_run.repository.js";
import { PayrollSettings } from "../../../common/types/payroll/Payroll.js";
import {
  markPayrollSettingsSynced,
  upsertPayrollSettings,
} from "../../database/repositories/payroll_settings.repository.js";
import { AttendanceDailyCheck } from "../../../common/types/AttendanceDailyCheck.js";
import {
  markAttendanceDailyCheckSynced,
  upsertAttendanceDailyCheck,
} from "../../database/repositories/attendanceDailyCheck.repository.js";
import { get } from "../../database/db.js";
import {
  getSyncState,
  updateLastPulledVersion,
} from "../../database/repositories/syncState.repository.js";
const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

interface VersionPullResponse<T> {
  items: T[];
  nextVersion: number;
  hasMore: boolean;
  serverTime?: string;
}
interface VersionPullResult<T> {
  items: T[];
  serverTime?: string;
}
export async function pullLatestChanges() {
  console.log("PULL SERVICE API URL:", API_URL);
  try {
    let latestServerTime: string | undefined;
    /* * ======================================================== * EMPLOYEES * ======================================================== */
    const employeesResult = await pullEntityByVersion<Employee>(
      "employee",
      syncEmployees
    );
    latestServerTime = employeesResult.serverTime ?? latestServerTime;
    const employees = employeesResult.items;
    /* * ======================================================== * ADMIN USERS * ======================================================== */
    const adminUsersResult = await pullEntityByVersion<AdminUser>(
      "admin_user",
      syncAdminUsers
    );
    latestServerTime = adminUsersResult.serverTime ?? latestServerTime;
    const adminUsers = adminUsersResult.items;
    /* * ======================================================== * EMPLOYEE DOCUMENTS * ======================================================== */
    const employeeDocumentsResult = await pullEntityByVersion<EmployeeDocument>(
      "employee_document",
      syncEmployeeDocuments
    );
    latestServerTime = employeeDocumentsResult.serverTime ?? latestServerTime;
    const employeesDocuments = employeeDocumentsResult.items;
    /* * ======================================================== * ATTENDANCES * ======================================================== */
    const attendancesResult = await pullEntityByVersion<Attendance>(
      "attendance",
      syncAttendances
    );
    latestServerTime = attendancesResult.serverTime ?? latestServerTime;
    const attendances = attendancesResult.items;
    /* * ======================================================== * ATTENDANCE DAILY CHECKS * ======================================================== */
    const attendanceDailyChecksResult =
      await pullEntityByVersion<AttendanceDailyCheck>(
        "attendance_daily_check",
        syncAttendanceDailyChecks
      );
    latestServerTime =
      attendanceDailyChecksResult.serverTime ?? latestServerTime;
    const attendanceDailyCheck = attendanceDailyChecksResult.items;
    /* * ======================================================== * LEAVES * ======================================================== */
    const leavesResult = await pullEntityByVersion<Leave>("leave", syncLeaves);
    latestServerTime = leavesResult.serverTime ?? latestServerTime;
    const leaves = leavesResult.items;
    /* * ======================================================== * TASKS * ======================================================== */
    const tasksResult = await pullEntityByVersion<Task>("task", syncTasks);
    latestServerTime = tasksResult.serverTime ?? latestServerTime;
    const tasks = tasksResult.items;
    /* * ======================================================== * PAYROLL SETTINGS * ======================================================== */
    const payrollSettingsResult = await pullEntityByVersion<PayrollSettings>(
      "payroll_settings",
      syncPayrollSettings
    );
    latestServerTime = payrollSettingsResult.serverTime ?? latestServerTime;
    const payrollSettings = payrollSettingsResult.items;
    /* * ======================================================== * PAYROLL COMPONENTS * ======================================================== */
    const payrollComponentsResult = await pullEntityByVersion<PayrollComponent>(
      "payroll_component",
      syncPayrollComponents
    );
    latestServerTime = payrollComponentsResult.serverTime ?? latestServerTime;
    const payrollComponents = payrollComponentsResult.items;
    /* * ======================================================== * PAYROLL EMPLOYEE PROFILES * ======================================================== */
    const payrollEmployeeProfilesResult =
      await pullEntityByVersion<PayrollEmployeeProfile>(
        "payroll_profile",
        syncPayrollEmployeeProfiles
      );
    latestServerTime =
      payrollEmployeeProfilesResult.serverTime ?? latestServerTime;
    const payrollEmployeeProfiles = payrollEmployeeProfilesResult.items;
    /* * ======================================================== * PAYROLL RUNS * ======================================================== * * Must be pulled before payroll results. */
    const payrollRunsResult = await pullEntityByVersion<PayrollRun>(
      "payroll_run",
      syncPayrollRuns
    );
    latestServerTime = payrollRunsResult.serverTime ?? latestServerTime;
    const payrollRuns = payrollRunsResult.items;
    /* * ======================================================== * PAYROLL RESULTS * ======================================================== * * Must be pulled after payroll runs. */
    const payrollResultsResult = await pullEntityByVersion<PayrollResult>(
      "payroll_result",
      syncPayrollResults
    );
    latestServerTime = payrollResultsResult.serverTime ?? latestServerTime;
    const payrollResults = payrollResultsResult.items;
    /* * ======================================================== * PAYROLL ITEMS * ======================================================== * * Must be pulled after payroll results. */
    const payrollItemsResult = await pullEntityByVersion<PayrollItem>(
      "payroll_item",
      syncPayrollItems
    );
    latestServerTime = payrollItemsResult.serverTime ?? latestServerTime;
    const payrollItems = payrollItemsResult.items;
    /* * ======================================================== * EMPLOYEE PHOTOS * ======================================================== * * Employee records have already been synced. * Therefore photo metadata is available. */
    await syncEmployeePhotos(employees);
    /* * ======================================================== * SYNC METADATA * ======================================================== * * These do NOT control synchronization. * * They are simply useful metadata. */
    const completedAt = new Date().toISOString();
    await setSetting("lastSync", completedAt);
    if (latestServerTime) {
      await setSetting("serverTime", latestServerTime);
    }
    /* * ======================================================== * LOGGING * ======================================================== */
    console.log("PULL SYNC COMPLETED SUCCESSFULLY.");
    console.log("SYNC SUMMARY:", {
      employees: employees.length,
      adminUsers: adminUsers.length,
      employeesDocuments: employeesDocuments.length,
      attendances: attendances.length,
      attendanceDailyCheck: attendanceDailyCheck.length,
      leaves: leaves.length,
      tasks: tasks.length,
      payrollSettings: payrollSettings.length,
      payrollComponents: payrollComponents.length,
      payrollEmployeeProfiles: payrollEmployeeProfiles.length,
      payrollRuns: payrollRuns.length,
      payrollResults: payrollResults.length,
      payrollItems: payrollItems.length,
      lastSync: completedAt,
      serverTime: latestServerTime,
    });
    return {
      employees,
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
      lastSync: completedAt,
      serverTime: latestServerTime,
    };
  } catch (error) {
    /* * IMPORTANT: * * lastSync is NOT updated here. * * If synchronization fails, the previous lastSync * remains intact. * * Individual entity cursors are also only advanced * after successful batches. */
    console.error("PULL SYNC FAILED:", error);
    throw error;
  }
}
async function pullEntityByVersion<T>(
  entity: string,
  syncBatch: (items: T[]) => Promise<boolean>,
  limit = 500
): Promise<VersionPullResult<T>> {
  const syncState = await getSyncState(entity);
  let afterVersion = syncState.lastPulledVersion ?? 0;
  const allItems: T[] = [];
  let hasMore = true;
  let latestServerTime: string | undefined;
  while (hasMore) {
    console.log(
      `PULLING ${entity.toUpperCase()} ` + `AFTER VERSION ${afterVersion}`
    );
    const response = await axios.get<VersionPullResponse<T>>(
      `${API_URL}/sync/pull`,
      { params: { entity, afterVersion, limit }, timeout: 90000 }
    );
    const {
      items,
      nextVersion,
      hasMore: serverHasMore,
      serverTime,
    } = response.data;
    latestServerTime = serverTime ?? latestServerTime;
    const batch = items ?? [];
    console.log(`${entity.toUpperCase()} VERSION PULL RESULT:`, {
      afterVersion,
      received: batch.length,
      nextVersion,
      hasMore: serverHasMore,
      serverTime,
    });
    if (batch.length === 0) {
      break;
    }
    const succeeded = await syncBatch(batch);
    if (!succeeded) {
      throw new Error(
        `${entity.toUpperCase()} SYNC FAILED AFTER VERSION ` +
          `${afterVersion}. SYNC CURSOR WAS NOT ADVANCED.`
      );
    }
    const newVersion = Number(nextVersion ?? afterVersion);
    if (!Number.isFinite(newVersion)) {
      throw new Error(
        `${entity.toUpperCase()} RETURNED INVALID NEXT VERSION: ` +
          `${nextVersion}`
      );
    }
    if (newVersion <= afterVersion) {
      throw new Error(
        `${entity.toUpperCase()} SYNC VERSION DID NOT ADVANCE. ` +
          `Current: ${afterVersion}, ` +
          `Next: ${newVersion}`
      );
    }
    await updateLastPulledVersion(entity, newVersion);
    afterVersion = newVersion;
    allItems.push(...batch);
    hasMore = Boolean(serverHasMore);
  }
  console.log(`${entity.toUpperCase()} VERSION SYNC COMPLETE:`, {
    totalItems: allItems.length,
    lastVersion: afterVersion,
    serverTime: latestServerTime,
  });
  return { items: allItems, serverTime: latestServerTime };
}

async function syncAdminUsers(adminUsers: AdminUser[]): Promise<boolean> {
  if (!adminUsers || adminUsers.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const adminUser of adminUsers) {
    try {
      await upsertAdminUser(adminUser);
    } catch (error) {
      succeeded = false;
      console.error("FAILED TO SYNC PULLED ADMIN USER:", adminUser._id, error);
    }
  }
  return succeeded;
}

async function syncEmployees(employees: Employee[]): Promise<boolean> {
  if (!employees || employees.length === 0) {
    console.log("NO EMPLOYEES TO SYNC.");
    return true;
  }
  const sortedEmployees = [...employees].sort(
    (a, b) => (a.serverVersion ?? 0) - (b.serverVersion ?? 0)
  );
  let allSucceeded = true;
  for (const employee of sortedEmployees) {
    try {
      console.log(
        `SYNCING EMPLOYEE ${employee._id} ` +
          `(serverVersion=${employee.serverVersion})`
      );
      await upsertEmployee(employee);
      await markEmployeeSynced(employee._id);
      console.log(
        `EMPLOYEE SYNCED ${employee._id} ` + `(v${employee.serverVersion})`
      );
    } catch (error) {
      allSucceeded = false;
      console.error("FAILED TO SYNC PULLED EMPLOYEE:", {
        employeeId: employee._id,
        serverVersion: employee.serverVersion,
        error,
      });
    }
  }
  return allSucceeded;
}

async function syncEmployeePhotos(employees: Employee[]) {
  for (const employee of employees) {
    try {
      if (!employee.photo_filename || employee.photo_version == null) {
        continue;
      }
      const localEmployee = await getEmployeeById(employee._id);
      const localPhotoVersion = localEmployee?.photo_version ?? 0;
      if (localPhotoVersion >= employee.photo_version) {
        console.log(
          `PHOTO ALREADY UP TO DATE FOR ` +
            `${employee.firstName} ` +
            `${employee.lastName}`
        );
        continue;
      }
      await downloadEmployeePhoto(employee._id, employee.photo_filename);
      const employeeFolderName =
        `${employee.firstName}_${employee.lastName}_${employee._id}`
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
          .replace(/\s+/g, "_");
      await updateEmployeePhotoMetadata(employee._id, {
        photo_path: path.join(
          "employees_photos",
          employeeFolderName,
          employee.photo_filename
        ),
        photo_filename: employee.photo_filename,
        photo_version: employee.photo_version,
        photo_hash: employee.photo_hash,
        photo_mime_type: employee.photo_mime_type,
        photo_last_modified: employee.photo_last_modified,
      });
      console.log(
        `DOWNLOADED NEW PHOTO FOR ` +
          `${employee.firstName} ` +
          `${employee.lastName}. ` +
          `Version ${employee.photo_version}`
      );
    } catch (error) {
      console.error(`FAILED TO SYNC PHOTO FOR EMPLOYEE ${employee._id}`, error);
    }
  }
}

async function syncEmployeeDocuments(
  employeeDocuments: EmployeeDocument[]
): Promise<boolean> {
  if (!employeeDocuments || employeeDocuments.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const document of employeeDocuments) {
    try {
      const localDocument = await getEmployeeDocument(
        document.employeeId,
        document.documentType
      );
      const localVersion = localDocument?.serverVersion ?? 0;
      if (localVersion >= document.serverVersion) {
        console.log(
          `DOCUMENT ALREADY UP TO DATE: ` +
            `${document.employeeId} ` +
            `(${document.documentType})`
        );
        continue;
      }
      const employee = await getEmployeeById(document.employeeId);
      if (!employee) {
        throw new Error(
          `Employee ${document.employeeId} not found while syncing document`
        );
      }
      await downloadEmployeeDocument(employee, document);
      const employeeFolderName =
        `${employee.firstName}_${employee.lastName}_${employee._id}`
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
          .replace(/\s+/g, "_");
      await upsertEmployeeDocument({
        ...document,
        localPath: path.join(
          "employees_documents",
          employeeFolderName,
          document.documentType,
          document.fileName
        ),
      });
      await markEmployeeDocumentSynced(document._id);
      console.log(
        `DOWNLOADED ${document.documentType} ` +
          `FOR ${employee.firstName} ` +
          `${employee.lastName} ` +
          `(v${document.serverVersion})`
      );
    } catch (error) {
      succeeded = false;
      console.error(`FAILED TO SYNC DOCUMENT ${document._id}`, error);
    }
  }
  return succeeded;
}

async function syncAttendances(attendances: Attendance[]): Promise<boolean> {
  if (!attendances || attendances.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const attendance of attendances) {
    try {
      await upsertAttendance(attendance);
      await markAttendanceSynced(attendance._id);
    } catch (error) {
      succeeded = false;
      console.error("FAILED TO SYNC PULLED ATTENDANCE:", attendance._id, error);
    }
  }
  return succeeded;
}

async function syncAttendanceDailyChecks(
  attendanceDailyChecks: AttendanceDailyCheck[]
): Promise<boolean> {
  if (!attendanceDailyChecks || attendanceDailyChecks.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const attendanceDailyCheck of attendanceDailyChecks) {
    try {
      await upsertAttendanceDailyCheck(attendanceDailyCheck);
      await markAttendanceDailyCheckSynced(attendanceDailyCheck._id);
    } catch (error) {
      succeeded = false;
      console.error(
        "FAILED TO SYNC PULLED ATTENDANCE DAILY CHECK:",
        attendanceDailyCheck._id,
        error
      );
    }
  }
  return succeeded;
}
async function syncLeaves(leaves: Leave[]): Promise<boolean> {
  if (!leaves || leaves.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const leave of leaves) {
    try {
      await upsertLeave(leave);
      await markLeaveSynced(leave._id);
    } catch (error) {
      succeeded = false;
      console.error("FAILED TO SYNC PULLED LEAVE:", leave._id, error);
    }
  }
  return succeeded;
}
async function syncTasks(tasks: Task[]): Promise<boolean> {
  if (!tasks || tasks.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const task of tasks) {
    try {
      await upsertTask(task);
      if (task.comments?.length) {
        await Promise.all(
          task.comments.map((comment) => upsertTaskComment(comment))
        );
      }
      await markTaskSynced(task._id);
    } catch (error) {
      succeeded = false;
      console.error("FAILED TO SYNC PULLED TASK:", task._id, error);
    }
  }
  return succeeded;
}

async function syncPayrollSettings(
  payrollSettings: PayrollSettings[]
): Promise<boolean> {
  if (!payrollSettings || payrollSettings.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const settings of payrollSettings) {
    try {
      await upsertPayrollSettings(settings);
      await markPayrollSettingsSynced(settings._id);
    } catch (error) {
      succeeded = false;
      console.error(
        "FAILED TO SYNC PULLED PAYROLL SETTINGS:",
        settings._id,
        error
      );
    }
  }
  return succeeded;
}
async function syncPayrollComponents(
  payrollComponents: PayrollComponent[]
): Promise<boolean> {
  if (!payrollComponents || payrollComponents.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const component of payrollComponents) {
    try {
      await upsertPayrollComponent(component);
      await markPayrollComponentSynced(component._id);
    } catch (error) {
      succeeded = false;
      console.error(
        "FAILED TO SYNC PULLED PAYROLL COMPONENT:",
        component._id,
        error
      );
    }
  }
  return succeeded;
}

async function syncPayrollEmployeeProfiles(
  payrollEmployeeProfiles: PayrollEmployeeProfile[]
): Promise<boolean> {
  if (!payrollEmployeeProfiles || payrollEmployeeProfiles.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const profile of payrollEmployeeProfiles) {
    if (!profile._id) {
      continue;
    }
    try {
      await upsertEmployeePayrollProfile(profile);
      await markPayrollEmployeeProfileSynced(profile._id);
    } catch (error) {
      succeeded = false;
      console.error(
        "FAILED TO SYNC PULLED PAYROLL EMPLOYEE PROFILE:",
        profile._id,
        error
      );
    }
  }
  return succeeded;
}

async function syncPayrollRuns(payrollRuns: PayrollRun[]): Promise<boolean> {
  if (!payrollRuns || payrollRuns.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const payrollRun of payrollRuns) {
    if (!payrollRun._id) {
      continue;
    }
    try {
      await upsertPayrollRun(payrollRun);
      await markPayrollRunSynced(payrollRun._id);
      console.log("PAYROLL RUN SYNCED:", payrollRun._id);
    } catch (error) {
      succeeded = false;
      console.error(
        "FAILED TO SYNC PULLED PAYROLL RUN:",
        payrollRun._id,
        error
      );
    }
  }
  return succeeded;
}

async function syncPayrollResults(
  payrollResults: PayrollResult[]
): Promise<boolean> {
  if (!payrollResults || payrollResults.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const result of payrollResults) {
    if (!result._id) {
      continue;
    }
    try {
      const payrollRun = await get(
        ` SELECT _id FROM payroll_runs WHERE _id = ? LIMIT 1 `,
        [result.payrollRunId]
      );
      if (!payrollRun) {
        console.error(
          "SKIPPING PAYROLL RESULT: PAYROLL RUN DOES NOT EXIST LOCALLY",
          { resultId: result._id, payrollRunId: result.payrollRunId }
        );
        succeeded = false;
        continue;
      }
      const employee = await get(
        ` SELECT _id FROM employees WHERE _id = ? LIMIT 1 `,
        [result.employeeId]
      );
      if (!employee) {
        console.error(
          "SKIPPING PAYROLL RESULT: EMPLOYEE DOES NOT EXIST LOCALLY",
          { resultId: result._id, employeeId: result.employeeId }
        );
        succeeded = false;
        continue;
      }
      await upsertPayrollResult(result);
      await markPayrollResultSynced(result._id);
      console.log("PAYROLL RESULT SYNCED:", result._id);
    } catch (error) {
      succeeded = false;
      console.error("FAILED TO SYNC PULLED PAYROLL RESULT:", {
        resultId: result._id,
        payrollRunId: result.payrollRunId,
        employeeId: result.employeeId,
        error,
      });
    }
  }
  return succeeded;
}

async function syncPayrollItems(payrollItems: PayrollItem[]): Promise<boolean> {
  if (!payrollItems || payrollItems.length === 0) {
    return true;
  }
  let succeeded = true;
  for (const item of payrollItems) {
    if (!item._id) {
      continue;
    }
    try {
      await upsertPayrollItem(item);
      await markPayrollItemSynced(item._id);
    } catch (error) {
      succeeded = false;
      console.error("FAILED TO SYNC PULLED PAYROLL ITEM:", item._id, error);
    }
  }
  return succeeded;
}
