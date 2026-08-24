import axios from "axios";
import { app } from "electron";
import path from "path";
import { getEmployeeById } from "../../database/repositories/employees.repository.js";
import {
  getSetting,
  setSetting,
} from "../../database/repositories/settings.repository.js";
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

export async function pullLatestChanges() {
  console.log("PULL SERVICE API URL:", API_URL);

  try {
    const employees = await pullEmployeesByVersion();

    const lastSync =
      (await getSetting("lastSync")) ?? "1970-01-01T00:00:00.000Z";

    const response = await axios.get(`${API_URL}/sync/pull`, {
      params: {
        since: lastSync,
      },
      timeout: 90000,
    });

    const {
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
      serverTime,
    } = response.data;

    console.log("PULLED LEGACY SYNC ITEMS");

    console.log("EMPLOYEES SYNCED USING VERSION:", employees.length);

    console.log("FETCHED ADMIN USERS:", adminUsers?.length ?? 0);

    console.log(
      "FETCHED EMPLOYEES DOCUMENTS:",
      employeesDocuments?.length ?? 0
    );

    console.log("FETCHED ATTENDANCES:", attendances?.length ?? 0);

    console.log(
      "FETCHED ATTENDANCE DAILY CHECK:",
      attendanceDailyCheck?.length ?? 0
    );

    console.log("FETCHED LEAVES:", leaves?.length ?? 0);

    console.log("FETCHED TASKS:", tasks?.length ?? 0);

    console.log("FETCHED PAYROLL SETTINGS:", payrollSettings ? 1 : 0);

    console.log("FETCHED PAYROLL COMPONENTS:", payrollComponents?.length ?? 0);

    console.log(
      "FETCHED PAYROLL EMPLOYEE PROFILES:",
      payrollEmployeeProfiles?.length ?? 0
    );

    console.log("FETCHED PAYROLL RUNS:", payrollRuns?.length ?? 0);

    console.log("FETCHED PAYROLL RESULTS:", payrollResults?.length ?? 0);

    console.log("FETCHED PAYROLL ITEMS:", payrollItems?.length ?? 0);

    /*
     * =========================================================
     * SYNC LEGACY ENTITIES
     * =========================================================
     */

    await syncAdminUsers(adminUsers);

    /*
     * Employees are already synced above.
     *
     * We intentionally pass them here only because employee
     * photos depend on the employee data.
     */
    await syncEmployeePhotos(employees);

    await syncEmployeeDocuments(employeesDocuments);

    await syncAttendances(attendances);

    await syncAttendanceDailyChecks(attendanceDailyCheck);

    await syncLeaves(leaves);

    await syncTasks(tasks);

    await syncPayrollSettings(payrollSettings);

    await syncPayrollComponents(payrollComponents);

    await syncPayrollEmployeeProfiles(payrollEmployeeProfiles);

    /*
     * Payroll dependencies must be synced in this order.
     */

    await syncPayrollRuns(payrollRuns);

    await syncPayrollResults(payrollResults);

    await syncPayrollItems(payrollItems);

    /*
     * =========================================================
     * UPDATE LEGACY SYNC CURSOR
     * =========================================================
     */

    await setSetting("lastSync", serverTime);

    console.log("PULL SYNC COMPLETED SUCCESSFULLY.");

    return response;
  } catch (error) {
    console.error("PULL SYNC FAILED:", error);

    throw error;
  }
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

async function syncAttendances(attendances: Attendance[]) {
  for (const attendance of attendances) {
    try {
      await upsertAttendance(attendance);
      await markAttendanceSynced(attendance._id);
    } catch (error) {
      console.error("FAILED TO SYNC PULLED ATTENDANCE:", attendance._id, error);
    }
  }
}

async function syncAttendanceDailyChecks(
  attendanceDailyChecks: AttendanceDailyCheck[]
) {
  if (!attendanceDailyChecks || attendanceDailyChecks.length === 0) return;
  console.log("PULLED ATTENDANCE DAILY CHECKS:", attendanceDailyChecks);
  for (const attendanceDailyCheck of attendanceDailyChecks) {
    try {
      await upsertAttendanceDailyCheck(attendanceDailyCheck);
      await markAttendanceDailyCheckSynced(attendanceDailyCheck._id);
    } catch (error) {
      console.error(
        "FAILED TO SYNC PULLED ATTENDANCE DAILY CHECK:",
        attendanceDailyCheck._id,
        error
      );
    }
  }
}

async function syncLeaves(leaves: Leave[]) {
  for (const leave of leaves) {
    try {
      await upsertLeave(leave);
      await markLeaveSynced(leave._id);
    } catch (error) {
      console.error("FAILED TO SYNC PULLED LEAVE:", leave._id, error);
    }
  }
}

async function syncTasks(tasks: Task[]) {
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
      console.error("FAILED TO SYNC PULLED TASK:", task._id, error);
    }
  }
}

async function syncAdminUsers(adminUsers: AdminUser[]) {
  for (const adminUser of adminUsers) {
    try {
      await upsertAdminUser(adminUser);
    } catch (error) {
      console.error("FAILED TO SYNC PULLED ADMIN USERS:", adminUser._id, error);
    }
  }
}

async function syncEmployeePhotos(employees: Employee[]) {
  for (const employee of employees) {
    try {
      if (!employee.photo_filename || employee.photo_version == null) {
        continue;
      }

      const localEmployee = await getEmployeeById(employee._id);

      const localPhotoVersion = localEmployee?.photo_version ?? 0;

      // Skip if local photo is already newer or equal
      if (localPhotoVersion >= employee.photo_version) {
        console.log(
          `PHOTO ALREADY UP TO DATE FOR ${employee.firstName} ${employee.lastName}`
        );
        continue;
      }

      // Download photo from server
      await downloadEmployeePhoto(employee._id, employee.photo_filename);

      // Folder name
      const employeeFolderName =
        `${employee.firstName}_${employee.lastName}_${employee._id}`
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
          .replace(/\s+/g, "_");

      // Save local photo metadata
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
        `DOWNLOADED NEW PHOTO FOR ${employee.firstName} ${employee.lastName}. Version ${employee.photo_version}`
      );
    } catch (error) {
      console.error(`FAILED TO SYNC PHOTO FOR EMPLOYEE ${employee._id}`, error);
    }
  }
}
async function syncEmployeeDocuments(employeeDocuments: EmployeeDocument[]) {
  for (const document of employeeDocuments) {
    try {
      const localDocument = await getEmployeeDocument(
        document.employeeId,
        document.documentType
      );

      const localVersion = localDocument?.version ?? 0;

      // Already up to date
      if (localVersion >= document.version) {
        console.log(
          `DOCUMENT ALREADY UP TO DATE: ${document.employeeId} (${document.documentType})`
        );
        continue;
      }

      const employee = await getEmployeeById(document.employeeId);

      if (!employee) {
        throw new Error(
          `Employee ${document.employeeId} not found while syncing document`
        );
      }

      // Download latest document
      await downloadEmployeeDocument(employee, document);

      // Folder name
      const employeeFolderName =
        `${employee.firstName}_${employee.lastName}_${employee._id}`
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
          .replace(/\s+/g, "_");

      // Update local metadata
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
        `DOWNLOADED ${document.documentType} FOR ${employee.firstName} ${employee.lastName} (v${document.version})`
      );
    } catch (error) {
      console.error(`FAILED TO SYNC DOCUMENT ${document._id}`, error);
    }
  }
}

async function syncPayrollSettings(payrollSettings: PayrollSettings) {
  if (!payrollSettings) return;
  try {
    await upsertPayrollSettings(payrollSettings);
    await markPayrollSettingsSynced(payrollSettings._id);
  } catch (error) {
    console.error(
      "FAILED TO SYNC PULLED PAYROLL SETTINGS:",
      payrollSettings._id,
      error
    );
  }
}

async function syncPayrollComponents(payrollComponents: PayrollComponent[]) {
  for (const component of payrollComponents) {
    try {
      await upsertPayrollComponent(component);
      await markPayrollComponentSynced(component._id);
    } catch (error) {
      console.error(
        "FAILED TO SYNC PULLED PAYROLL COMPONENT:",
        component._id,
        error
      );
    }
  }
}

async function syncPayrollEmployeeProfiles(
  payrollEmployeeProfiles: PayrollEmployeeProfile[]
) {
  for (const component of payrollEmployeeProfiles) {
    if (!component._id) continue;
    try {
      await upsertEmployeePayrollProfile(component);
      await markPayrollEmployeeProfileSynced(component._id);
    } catch (error) {
      console.error(
        "FAILED TO SYNC PULLED PAYROLL EMPLOYEE PROFILE:",
        component._id,
        error
      );
    }
  }
}

async function syncPayrollRuns(
  payrollRuns: PayrollRun[]
): Promise<Set<string>> {
  const syncedRunIds = new Set<string>();

  for (const payrollRun of payrollRuns) {
    if (!payrollRun._id) continue;

    try {
      await upsertPayrollRun(payrollRun);
      await markPayrollRunSynced(payrollRun._id);
      syncedRunIds.add(payrollRun._id);
      console.log("PAYROLL RUN SYNCED:", payrollRun._id);
    } catch (error) {
      console.error(
        "FAILED TO SYNC PULLED PAYROLL RUN:",
        payrollRun._id,
        error
      );
    }
  }

  return syncedRunIds;
}

async function syncPayrollResults(payrollResults: PayrollResult[]) {
  for (const result of payrollResults) {
    if (!result._id) continue;

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
          "SKIPPING PAYROLL RESULT: PAYROLL RUN DOES NOT EXIST LOCALLY",
          {
            resultId: result._id,
            payrollRunId: result.payrollRunId,
          }
        );

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
          "SKIPPING PAYROLL RESULT: EMPLOYEE DOES NOT EXIST LOCALLY",
          {
            resultId: result._id,
            employeeId: result.employeeId,
          }
        );

        continue;
      }

      await upsertPayrollResult(result);

      await markPayrollResultSynced(result._id);

      console.log("PAYROLL RESULT SYNCED:", result._id);
    } catch (error) {
      console.error("FAILED TO SYNC PULLED PAYROLL RESULT:", {
        resultId: result._id,
        payrollRunId: result.payrollRunId,
        employeeId: result.employeeId,
        error,
      });
    }
  }
}

async function syncPayrollItems(PayrollItems: PayrollItem[]) {
  for (const item of PayrollItems) {
    if (!item._id) continue;
    try {
      await upsertPayrollItem(item);
      await markPayrollItemSynced(item._id);
    } catch (error) {
      console.error("FAILED TO SYNC PULLED PAYROLL RESULTS:", item._id, error);
    }
  }
}

async function pullEmployeesByVersion(): Promise<Employee[]> {
  const syncState = await getSyncState("employee");

  let afterVersion = syncState.lastPulledVersion ?? 0;

  const allEmployees: Employee[] = [];

  let hasMore = true;

  while (hasMore) {
    console.log(`PULLING EMPLOYEES AFTER VERSION ${afterVersion}`);

    const response = await axios.get(`${API_URL}/sync/pull`, {
      params: {
        entity: "employee",
        afterVersion,
        limit: 500,
      },
      timeout: 90000,
    });

    const { items, nextVersion, hasMore: serverHasMore } = response.data;

    const employees: Employee[] = items ?? [];

    console.log("EMPLOYEE VERSION PULL RESULT:", {
      afterVersion,
      received: employees.length,
      nextVersion,
      hasMore: serverHasMore,
    });

    /*
     * No changes.
     */
    if (employees.length === 0) {
      break;
    }

    /*
     * Sync this batch.
     *
     * IMPORTANT:
     * Do not advance the cursor if any employee fails.
     */
    const employeesSyncedSuccessfully = await syncEmployees(employees);

    if (!employeesSyncedSuccessfully) {
      throw new Error(
        `EMPLOYEE SYNC FAILED AFTER VERSION ${afterVersion}. ` +
          `SYNC CURSOR WAS NOT ADVANCED.`
      );
    }

    const newVersion = Number(nextVersion ?? afterVersion);

    /*
     * Safety check against an infinite loop.
     */
    if (newVersion <= afterVersion) {
      throw new Error(
        `EMPLOYEE SYNC VERSION DID NOT ADVANCE. ` +
          `Current: ${afterVersion}, Next: ${newVersion}`
      );
    }

    /*
     * Only advance the cursor AFTER the entire batch
     * successfully reached SQLite.
     */
    await updateLastPulledVersion("employee", newVersion);

    afterVersion = newVersion;

    allEmployees.push(...employees);

    hasMore = Boolean(serverHasMore);
  }

  console.log("EMPLOYEE VERSION SYNC COMPLETE:", {
    totalEmployees: allEmployees.length,
    lastVersion: afterVersion,
  });

  return allEmployees;
}
