import axios from "axios";
import { app } from "electron";
import fs from "fs/promises";
import path from "path";

import {
  getEmployeeById,
  markEmployeeSynced,
  upsertEmployee,
} from "../../database/repositories/employees.repository.js";

import { setSetting } from "../../database/repositories/settings.repository.js";
import { upsertAdminUser } from "../../database/repositories/admin_users.repository.js";

import {
  getAttendanceByEmployeeAndDate,
  getAttendanceById,
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

import { all, get } from "../../database/db.js";

import {
  getSyncState,
  updateLastPulledVersion,
} from "../../database/repositories/syncState.repository.js";

import { EMPLOYEE_PHOTO_DIR } from "../../storage/directories.js";

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

/**
 * ============================================================
 * MAIN PULL SYNC
 * ============================================================
 */

export async function pullLatestChanges() {
  console.log("PULL SERVICE API URL:", API_URL);

  try {
    let latestServerTime: string | undefined;

    /*
     * ========================================================
     * EMPLOYEES
     * ========================================================
     */

    const employeesResult = await pullEntityByVersion<Employee>(
      "employee",
      syncEmployees
    );

    latestServerTime = employeesResult.serverTime ?? latestServerTime;

    const employees = employeesResult.items;

    /*
     * ========================================================
     * ADMIN USERS
     * ========================================================
     */

    const adminUsersResult = await pullEntityByVersion<AdminUser>(
      "admin_user",
      syncAdminUsers
    );

    latestServerTime = adminUsersResult.serverTime ?? latestServerTime;

    const adminUsers = adminUsersResult.items;

    /*
     * ========================================================
     * EMPLOYEE DOCUMENTS
     * ========================================================
     */

    const employeeDocumentsResult = await pullEntityByVersion<EmployeeDocument>(
      "employee_document",
      syncEmployeeDocuments
    );

    latestServerTime = employeeDocumentsResult.serverTime ?? latestServerTime;

    const employeesDocuments = employeeDocumentsResult.items;

    /*
     * ========================================================
     * ATTENDANCES
     * ========================================================
     */

    const attendancesResult = await pullEntityByVersion<Attendance>(
      "attendance",
      syncAttendances
    );

    latestServerTime = attendancesResult.serverTime ?? latestServerTime;

    const attendances = attendancesResult.items;

    /*
     * ========================================================
     * ATTENDANCE DAILY CHECKS
     * ========================================================
     */

    const attendanceDailyChecksResult =
      await pullEntityByVersion<AttendanceDailyCheck>(
        "attendance_daily_check",
        syncAttendanceDailyChecks
      );

    latestServerTime =
      attendanceDailyChecksResult.serverTime ?? latestServerTime;

    const attendanceDailyCheck = attendanceDailyChecksResult.items;

    /*
     * ========================================================
     * LEAVES
     * ========================================================
     */

    const leavesResult = await pullEntityByVersion<Leave>("leave", syncLeaves);

    latestServerTime = leavesResult.serverTime ?? latestServerTime;

    const leaves = leavesResult.items;

    /*
     * ========================================================
     * TASKS
     * ========================================================
     */

    const tasksResult = await pullEntityByVersion<Task>("task", syncTasks);

    latestServerTime = tasksResult.serverTime ?? latestServerTime;

    const tasks = tasksResult.items;

    /*
     * ========================================================
     * PAYROLL SETTINGS
     * ========================================================
     */

    const payrollSettingsResult = await pullEntityByVersion<PayrollSettings>(
      "payroll_settings",
      syncPayrollSettings
    );

    latestServerTime = payrollSettingsResult.serverTime ?? latestServerTime;

    const payrollSettings = payrollSettingsResult.items;

    /*
     * ========================================================
     * PAYROLL COMPONENTS
     * ========================================================
     */

    const payrollComponentsResult = await pullEntityByVersion<PayrollComponent>(
      "payroll_component",
      syncPayrollComponents
    );

    latestServerTime = payrollComponentsResult.serverTime ?? latestServerTime;

    const payrollComponents = payrollComponentsResult.items;

    /*
     * ========================================================
     * PAYROLL EMPLOYEE PROFILES
     * ========================================================
     */

    const payrollEmployeeProfilesResult =
      await pullEntityByVersion<PayrollEmployeeProfile>(
        "payroll_profile",
        syncPayrollEmployeeProfiles
      );

    latestServerTime =
      payrollEmployeeProfilesResult.serverTime ?? latestServerTime;

    const payrollEmployeeProfiles = payrollEmployeeProfilesResult.items;

    /*
     * ========================================================
     * PAYROLL RUNS
     *
     * Must be pulled before payroll results.
     * ========================================================
     */

    const payrollRunsResult = await pullEntityByVersion<PayrollRun>(
      "payroll_run",
      syncPayrollRuns
    );

    latestServerTime = payrollRunsResult.serverTime ?? latestServerTime;

    const payrollRuns = payrollRunsResult.items;

    /*
     * ========================================================
     * PAYROLL RESULTS
     *
     * Must be pulled after payroll runs.
     * ========================================================
     */

    const payrollResultsResult = await pullEntityByVersion<PayrollResult>(
      "payroll_result",
      syncPayrollResults
    );

    latestServerTime = payrollResultsResult.serverTime ?? latestServerTime;

    const payrollResults = payrollResultsResult.items;

    /*
     * ========================================================
     * PAYROLL ITEMS
     *
     * Must be pulled after payroll results.
     * ========================================================
     */

    const payrollItemsResult = await pullEntityByVersion<PayrollItem>(
      "payroll_item",
      syncPayrollItems
    );

    latestServerTime = payrollItemsResult.serverTime ?? latestServerTime;

    const payrollItems = payrollItemsResult.items;

    /*
     * ========================================================
     * EMPLOYEE PHOTOS
     * ========================================================
     *
     * IMPORTANT:
     *
     * Photo synchronization is deliberately NOT based only on
     * employees returned by this pull.
     *
     * An employee may already have the latest serverVersion and
     * therefore not appear in the current version pull, while
     * their photo could still be missing locally.
     *
     * Therefore we reconcile photos against EVERY local employee.
     * ========================================================
     */

    await syncAllEmployeePhotos();

    /*
     * ========================================================
     * SYNC METADATA
     * ========================================================
     */

    const completedAt = new Date().toISOString();

    await setSetting("lastSync", completedAt);

    if (latestServerTime) {
      await setSetting("serverTime", latestServerTime);
    }

    /*
     * ========================================================
     * LOGGING
     * ========================================================
     */

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
    /*
     * IMPORTANT:
     *
     * lastSync is NOT updated here.
     *
     * Individual entity cursors are only advanced after the
     * corresponding batch has successfully completed.
     */

    console.error("PULL SYNC FAILED:", error);

    throw error;
  }
}

/**
 * ============================================================
 * VERSION PULL
 * ============================================================
 */

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
      `PULLING ${entity.toUpperCase()} AFTER VERSION ${afterVersion}`
    );

    const response = await axios.get<VersionPullResponse<T>>(
      `${API_URL}/sync/pull`,
      {
        params: {
          entity,
          afterVersion,
          limit,
        },
        timeout: 90000,
      }
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

    /*
     * No records means there is nothing else to pull.
     *
     * Do not attempt to advance the cursor.
     */
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

    /*
     * Advance the cursor ONLY after the entire batch succeeded.
     */
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

  return {
    items: allItems,
    serverTime: latestServerTime,
  };
}

/**
 * ============================================================
 * EMPLOYEES
 * ============================================================
 */

async function syncEmployees(employees: Employee[]): Promise<boolean> {
  if (!employees || employees.length === 0) {
    console.log("NO EMPLOYEES TO SYNC.");
    return true;
  }

  const sortedEmployees = [...employees].sort(
    (a, b) => Number(a.serverVersion ?? 0) - Number(b.serverVersion ?? 0)
  );

  let allSucceeded = true;

  for (const employee of sortedEmployees) {
    try {
      console.log("========== SERVER EMPLOYEE ==========");
      console.log({
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        photo_filename: employee.photo_filename,
        photo_version: employee.photo_version,
        photo_hash: employee.photo_hash,
        photo_mime_type: employee.photo_mime_type,
        photo_last_modified: employee.photo_last_modified,
      });

      await upsertEmployee(employee);

      console.log("========== LOCAL EMPLOYEE AFTER UPSERT ==========");

      const localEmployee = await getEmployeeById(employee._id);

      console.log({
        id: localEmployee?._id,
        name: `${localEmployee?.firstName} ${localEmployee?.lastName}`,
        photo_filename: localEmployee?.photo_filename,
        photo_version: localEmployee?.photo_version,
        photo_hash: localEmployee?.photo_hash,
        photo_mime_type: localEmployee?.photo_mime_type,
        photo_last_modified: localEmployee?.photo_last_modified,
      });

      await markEmployeeSynced(employee._id);
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

/**
 * ============================================================
 * EMPLOYEE PHOTOS
 * ============================================================
 *
 * Every pull cycle checks EVERY local employee.
 *
 * This handles:
 *
 * - first installation
 * - missing local photo files
 * - changed photo versions
 * - changed filenames
 * - photos that were deleted locally
 * - employees whose employee record did not change
 * ============================================================
 */

async function syncAllEmployeePhotos(): Promise<void> {
  console.log("STARTING EMPLOYEE PHOTO RECONCILIATION...");
  const localEmployees = await getAllEmployeesForPhotoSync();

  console.log(`CHECKING PHOTOS FOR ${localEmployees.length} EMPLOYEES...`);

  if (localEmployees.length === 0) {
    console.log("NO EMPLOYEES FOUND FOR PHOTO SYNC.");

    return;
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const employee of localEmployees) {
    try {
      const result = await syncEmployeePhoto(employee);

      if (result === "downloaded") {
        downloaded++;
      } else {
        skipped++;
      }
    } catch (error) {
      failed++;

      console.error(
        `FAILED TO SYNC PHOTO FOR EMPLOYEE ${employee._id}:`,
        error
      );
    }
  }

  console.log("EMPLOYEE PHOTO RECONCILIATION COMPLETE:", {
    total: localEmployees.length,
    downloaded,
    skipped,
    failed,
  });
}

/**
 * ============================================================
 * GET ALL LOCAL EMPLOYEES FOR PHOTO SYNC
 * ============================================================
 */

async function getAllEmployeesForPhotoSync(): Promise<Employee[]> {
  const rows = await all(
    `
      SELECT *
      FROM employees
      WHERE isDeleted = 0
      ORDER BY firstName ASC, lastName ASC
    `
  );

  return (rows ?? []) as Employee[];
}

/**
 * ============================================================
 * SYNC EMPLOYEE PHOTOS
 * ============================================================
 */

async function syncEmployeePhoto(
  employee: Employee
): Promise<"downloaded" | "skipped"> {
  console.log("EMPLOYEE OBJECT.CHECK PHOTO METADATA:", {
    employeeId: employee._id,
    photo_filename: employee.photo_filename,
    photo_path: employee.photo_path,
    photo_version: employee.photo_version,
    photo_hash: employee.photo_hash,
    photo_mime_type: employee.photo_mime_type,
    photo_last_modified: employee.photo_last_modified,
  });

  /*
   * ----------------------------------------------------------
   * NO PHOTO
   * ----------------------------------------------------------
   */

  if (!employee.photo_filename) {
    console.log("NO PHOTO FOR EMPLOYEE:", {
      employeeId: employee._id,
      name: `${employee.firstName} ${employee.lastName}`,
    });

    return "skipped";
  }

  /*
   * ----------------------------------------------------------
   * PHOTO VERSION REQUIRED
   * ----------------------------------------------------------
   */

  if (employee.photo_version == null) {
    console.warn("PHOTO FILENAME EXISTS BUT PHOTO VERSION IS MISSING:", {
      employeeId: employee._id,
      photo_filename: employee.photo_filename,
    });

    return "skipped";
  }

  /*
   * ----------------------------------------------------------
   * GET CURRENT LOCAL EMPLOYEE
   * ----------------------------------------------------------
   */

  const localEmployee = await getEmployeeById(employee._id);

  if (!localEmployee) {
    throw new Error(`LOCAL EMPLOYEE ${employee._id} NOT FOUND`);
  }

  /*
   * ----------------------------------------------------------
   * NORMALIZE VERSIONS
   * ----------------------------------------------------------
   */

  const serverPhotoVersion = Number(employee.photo_version);

  const localPhotoVersion = Number(localEmployee.photo_version ?? 0);

  /*
   * ----------------------------------------------------------
   * DETERMINE PHOTO PATH
   * ----------------------------------------------------------
   */

  const relativePhotoPath = path.join(
    "employees_photos",
    getEmployeePhotoFolderName(localEmployee),
    employee.photo_filename
  );

  const absolutePhotoPath = path.isAbsolute(relativePhotoPath)
    ? relativePhotoPath
    : path.join(app.getPath("userData"), relativePhotoPath);

  /*
   * ----------------------------------------------------------
   * CHECK FILE
   * ----------------------------------------------------------
   */

  const photoExists = await fileExists(absolutePhotoPath);

  /*
   * ----------------------------------------------------------
   * COMPARE METADATA
   * ----------------------------------------------------------
   */

  const versionIsCurrent = localPhotoVersion === serverPhotoVersion;

  const filenameIsCurrent =
    localEmployee.photo_filename === employee.photo_filename;

  const pathIsCurrent = localEmployee.photo_path === employee.photo_path;

  /*
   * ----------------------------------------------------------
   * PHOTO ALREADY SYNCHRONIZED
   * ----------------------------------------------------------
   */

  if (photoExists && versionIsCurrent && filenameIsCurrent && pathIsCurrent) {
    console.log(
      `PHOTO ALREADY UP TO DATE FOR ` +
        `${employee.firstName} ${employee.lastName}`,
      {
        employeeId: employee._id,
        photoVersion: localPhotoVersion,
        photoPath: absolutePhotoPath,
      }
    );

    return "skipped";
  }

  /*
   * ----------------------------------------------------------
   * DOWNLOAD REQUIRED
   * ----------------------------------------------------------
   */

  console.log(
    `PHOTO DOWNLOAD REQUIRED FOR ` +
      `${employee.firstName} ${employee.lastName}:`,
    {
      employeeId: employee._id,
      localPhotoVersion,
      serverPhotoVersion,
      localFilename: localEmployee.photo_filename,
      serverFilename: employee.photo_filename,
      localPhotoPath: localEmployee.photo_path,
      serverPhotoPath: employee.photo_path,
      photoExists,
      versionChanged: localPhotoVersion !== serverPhotoVersion,
      filenameChanged: !filenameIsCurrent,
      pathChanged: !pathIsCurrent,
      expectedPath: absolutePhotoPath,
    }
  );

  /*
   * ----------------------------------------------------------
   * DOWNLOAD
   * ----------------------------------------------------------
   */

  const downloadedPath = await downloadEmployeePhoto(
    employee._id,
    employee.photo_filename
  );

  /*
   * ----------------------------------------------------------
   * VERIFY DOWNLOAD
   * ----------------------------------------------------------
   */

  const downloadedFileExists = await fileExists(downloadedPath);

  if (!downloadedFileExists) {
    throw new Error(
      `PHOTO DOWNLOAD REPORTED SUCCESS BUT FILE ` +
        `DOES NOT EXIST: ${downloadedPath}`
    );
  }

  /*
   * ----------------------------------------------------------
   * UPDATE LOCAL PHOTO METADATA
   * ----------------------------------------------------------
   */

  await updateEmployeePhotoMetadata(employee._id, {
    photo_path: relativePhotoPath,
    photo_filename: employee.photo_filename,
    photo_version: serverPhotoVersion,
    photo_hash: employee.photo_hash,
    photo_mime_type: employee.photo_mime_type,
    photo_last_modified: employee.photo_last_modified,
  });

  /*
   * ----------------------------------------------------------
   * REMOVE OLD PHOTO
   * ----------------------------------------------------------
   */

  if (
    localEmployee.photo_filename &&
    localEmployee.photo_filename !== employee.photo_filename
  ) {
    await removeOldEmployeePhoto(localEmployee, localEmployee.photo_filename);
  }

  console.log(
    `DOWNLOADED NEW PHOTO FOR ` + `${employee.firstName} ${employee.lastName}`,
    {
      employeeId: employee._id,
      version: serverPhotoVersion,
      path: downloadedPath,
    }
  );

  return "downloaded";
}
/**
 * ============================================================
 * EMPLOYEE PHOTO FOLDER NAME
 * ============================================================
 */

function getEmployeePhotoFolderName(employee: Employee): string {
  return `${employee.firstName}_${employee.lastName}_${employee._id}`
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, "_");
}

/**
 * ============================================================
 * FILE EXISTS
 * ============================================================
 */

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * ============================================================
 * REMOVE OLD PHOTO
 * ============================================================
 */

async function removeOldEmployeePhoto(
  employee: Employee,
  oldFilename: string
): Promise<void> {
  try {
    const folderName = getEmployeePhotoFolderName(employee);

    const oldPath = path.join(EMPLOYEE_PHOTO_DIR, folderName, oldFilename);

    if (await fileExists(oldPath)) {
      await fs.unlink(oldPath);
      console.log("REMOVED OLD EMPLOYEE PHOTO:", oldPath);
    }
  } catch (error) {
    /*
     * Failure to remove an old file should not make the
     * synchronization fail.
     */

    console.warn("FAILED TO REMOVE OLD EMPLOYEE PHOTO:", {
      employeeId: employee._id,
      oldFilename,
      error,
    });
  }
}

/**
 * ============================================================
 * ADMIN USERS
 * ============================================================
 */

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

/**
 * ============================================================
 * EMPLOYEE DOCUMENTS
 * ============================================================
 */

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

      const localVersion = Number(localDocument?.serverVersion ?? 0);
      const remoteVersion = Number(document.serverVersion ?? 0);

      if (localDocument && localVersion >= remoteVersion) {
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
          `Employee ${document.employeeId} ` +
            `not found while syncing document`
        );
      }

      await downloadEmployeeDocument(employee, document);

      const employeeFolderName = getEmployeePhotoFolderName(employee);

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

/**
 * ============================================================
 * ATTENDANCES
 * ============================================================
 */

async function syncAttendances(attendances: Attendance[]): Promise<boolean> {
  if (!attendances || attendances.length === 0) {
    console.log("NO ATTENDANCES TO SYNC.");
    return true;
  }

  let succeeded = true;

  for (const attendance of attendances) {
    try {
      console.log("\n==================================================");
      console.log("ATTENDANCE SYNC START");
      console.log("==================================================");

      console.log("REMOTE ATTENDANCE:", {
        _id: attendance._id,
        employeeId: attendance.employeeId,
        date: attendance.date,
        clockIn: attendance.clockIn,
        clockOut: attendance.clockOut,
        status: attendance.status,
        source: attendance.source,
        lateMinutes: attendance.lateMinutes,
        notes: attendance.notes,
        serverVersion: attendance.serverVersion,
        isDeleted: attendance.isDeleted,
      });

      /*
       * ------------------------------------------------------
       * CHECK DATABASE BEFORE UPSERT
       * ------------------------------------------------------
       */

      const beforeById = await getAttendanceById(attendance._id);

      const beforeByEmployeeDate = await getAttendanceByEmployeeAndDate(
        attendance.employeeId,
        attendance.date
      );

      console.log("DATABASE BEFORE UPSERT:", {
        byId: beforeById,
        byEmployeeDate: beforeByEmployeeDate,
      });

      /*
       * ------------------------------------------------------
       * UPSERT
       * ------------------------------------------------------
       */

      console.log("CALLING upsertAttendance()...");

      console.log("🚨 REMOTE ATTENDANCE FULL OBJECT:", attendance);

      console.log("🚨 REMOTE ATTENDANCE DELETE STATE:", {
        remoteId: attendance._id,
        employeeId: attendance.employeeId,
        date: attendance.date,
        isDeleted: attendance.isDeleted,
        serverVersion: attendance.serverVersion,
      });

      const upsertedAttendance = await upsertAttendance(attendance);

      console.log("upsertAttendance() COMPLETED:", {
        result: upsertedAttendance,
      });

      /*
       * ------------------------------------------------------
       * CHECK DATABASE IMMEDIATELY AFTER UPSERT
       * ------------------------------------------------------
       */

      const afterUpsertById = await getAttendanceById(attendance._id);

      const afterUpsertByEmployeeDate = await getAttendanceByEmployeeAndDate(
        attendance.employeeId,
        attendance.date
      );

      console.log("DATABASE AFTER UPSERT:", {
        byId: afterUpsertById,
        byEmployeeDate: afterUpsertByEmployeeDate,
      });

      /*
       * ------------------------------------------------------
       * IMPORTANT:
       * Check whether the record actually exists.
       * ------------------------------------------------------
       */

      if (!afterUpsertById && !afterUpsertByEmployeeDate) {
        console.error("🚨 ATTENDANCE DISAPPEARED DURING upsertAttendance()!", {
          remoteId: attendance._id,
          employeeId: attendance.employeeId,
          date: attendance.date,
        });

        throw new Error(
          `Attendance ${attendance._id} disappeared immediately after upsert`
        );
      }

      /*
       * ------------------------------------------------------
       * DETERMINE ACTUAL LOCAL ID
       * ------------------------------------------------------
       */

      const actualLocalId =
        upsertedAttendance?._id ??
        afterUpsertById?._id ??
        afterUpsertByEmployeeDate?._id ??
        attendance._id;

      console.log("ATTENDANCE ID TO MARK SYNCED:", {
        remoteId: attendance._id,
        actualLocalId,
      });

      /*
       * ------------------------------------------------------
       * MARK SYNCED
       * ------------------------------------------------------
       */

      console.log("CALLING markAttendanceSynced()...");

      await markAttendanceSynced(actualLocalId);

      console.log("markAttendanceSynced() COMPLETED.");

      /*
       * ------------------------------------------------------
       * CHECK DATABASE AFTER MARK SYNCED
       * ------------------------------------------------------
       */

      const afterMarkSyncedById = await getAttendanceById(actualLocalId);

      const afterMarkSyncedByEmployeeDate =
        await getAttendanceByEmployeeAndDate(
          attendance.employeeId,
          attendance.date
        );

      console.log("DATABASE AFTER markAttendanceSynced():", {
        byId: afterMarkSyncedById,
        byEmployeeDate: afterMarkSyncedByEmployeeDate,
      });

      /*
       * ------------------------------------------------------
       * FINAL EXISTENCE CHECK
       * ------------------------------------------------------
       */

      if (!afterMarkSyncedById && !afterMarkSyncedByEmployeeDate) {
        console.error(
          "🚨🚨 ATTENDANCE DISAPPEARED AFTER markAttendanceSynced()!",
          {
            remoteId: attendance._id,
            actualLocalId,
            employeeId: attendance.employeeId,
            date: attendance.date,
          }
        );

        throw new Error(
          `Attendance ${actualLocalId} disappeared after markAttendanceSynced`
        );
      }

      console.log("✅ ATTENDANCE SYNC SUCCESS:", {
        remoteId: attendance._id,
        localId: actualLocalId,
        employeeId: attendance.employeeId,
        date: attendance.date,
      });

      console.log("==================================================");
      console.log("ATTENDANCE SYNC END");
      console.log("==================================================\n");
    } catch (error) {
      succeeded = false;

      console.error("❌ FAILED TO SYNC PULLED ATTENDANCE:", {
        attendanceId: attendance._id,
        employeeId: attendance.employeeId,
        date: attendance.date,
        error,
      });
    }
  }

  console.log("ATTENDANCE SYNC BATCH COMPLETE:", {
    total: attendances.length,
    succeeded,
  });

  return succeeded;
}

/**
 * ============================================================
 * ATTENDANCE DAILY CHECKS
 * ============================================================
 */

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

/**
 * ============================================================
 * LEAVES
 * ============================================================
 */

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

/**
 * ============================================================
 * TASKS
 * ============================================================
 */

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

/**
 * ============================================================
 * PAYROLL SETTINGS
 * ============================================================
 */

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

/**
 * ============================================================
 * PAYROLL COMPONENTS
 * ============================================================
 */

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

/**
 * ============================================================
 * PAYROLL EMPLOYEE PROFILES
 * ============================================================
 */

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

/**
 * ============================================================
 * PAYROLL RUNS
 * ============================================================
 */

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

/**
 * ============================================================
 * PAYROLL RESULTS
 * ============================================================
 */

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
        `
          SELECT _id
          FROM payroll_runs
          WHERE _id = ?
          LIMIT 1
        `,
        [result.payrollRunId]
      );

      if (!payrollRun) {
        console.error(
          "SKIPPING PAYROLL RESULT: PAYROLL RUN " + "DOES NOT EXIST LOCALLY",
          {
            resultId: result._id,
            payrollRunId: result.payrollRunId,
          }
        );

        succeeded = false;

        continue;
      }

      const employee = await get(
        `
          SELECT _id
          FROM employees
          WHERE _id = ?
          LIMIT 1
        `,
        [result.employeeId]
      );

      if (!employee) {
        console.error(
          "SKIPPING PAYROLL RESULT: EMPLOYEE " + "DOES NOT EXIST LOCALLY",
          {
            resultId: result._id,
            employeeId: result.employeeId,
          }
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

/**
 * ============================================================
 * PAYROLL ITEMS
 * ============================================================
 */

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
