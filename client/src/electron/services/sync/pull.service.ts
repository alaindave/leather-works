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

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export async function pullLatestChanges() {
  console.log("PULL SERVICE API URL:", API_URL);
  try {
    const lastSync =
      (await getSetting("lastSync")) ?? "1970-01-01T00:00:00.000Z";

    const response = await axios.get(`${API_URL}/sync/pull`, {
      params: {
        since: lastSync,
      },
    });

    const {
      adminUsers,
      employees,
      employeesDocuments,
      attendances,
      attendanceDailyChecks,
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
    console.log("PULLED ITEMS FROM SERVER");
    console.log("---------------------------");
    console.log("FETCHED ADMIN USERS:", adminUsers);
    console.log("FETCHED EMPLOYEES:", employees);
    console.log("FETCHED EMPLOYEES DOCUMENTS:", employeesDocuments);
    console.log("FETCHED ATTENDANCES:", attendances);
    console.log("FETCHED ATTENDANCE DAILY CHECK:", attendanceDailyChecks);
    console.log("FETCHED LEAVES:", leaves);
    console.log("FETCHED TASKS:", tasks);
    console.log("FETCHED PAYROLL SETTINGS:", payrollSettings);
    console.log("FETCHED PAYROLL COMPONENTS:", payrollComponents);
    console.log("FETCHED PAYROLL EMPLOYEE PROFILES:", payrollEmployeeProfiles);
    console.log("FETCHED PAYROLL RUNS:", payrollRuns);
    console.log("FETCHED PAYROLL RESULTS:", payrollResults);
    console.log("FETCHED PAYROLL ITEMS:", payrollItems);

    await syncAdminUsers(adminUsers);
    await syncEmployees(employees);
    await syncEmployeePhotos(employees);
    await syncEmployeeDocuments(employeesDocuments);
    await syncAttendances(attendances);
    await syncAttendanceDailyChecks(attendanceDailyChecks);
    await syncLeaves(leaves);
    await syncTasks(tasks);
    await syncPayrollSettings(payrollSettings);
    await syncPayrollComponents(payrollComponents);
    await syncPayrollEmployeeProfiles(payrollEmployeeProfiles);
    await syncPayrollRuns(payrollRuns);
    await syncPayrollResults(payrollResults);
    await syncPayrollItems(payrollItems);

    await setSetting("lastSync", serverTime);

    return response;
  } catch (error) {
    throw error;
  }
}

async function syncEmployees(employees: Employee[]) {
  for (const employee of employees) {
    try {
      await upsertEmployee(employee);
      await markEmployeeSynced(employee._id);
    } catch (error) {
      console.error("FAILED TO SYNC PULLED EMPLOYEE:", employee._id, error);
    }
  }
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

async function syncPayrollRuns(payrollRun: PayrollRun[]) {
  for (const run of payrollRun) {
    if (!run._id) continue;
    try {
      await upsertPayrollRun(run);
      await markPayrollRunSynced(run._id);
    } catch (error) {
      console.error("FAILED TO SYNC PULLED PAYROLL RUN:", run._id, error);
    }
  }
}

async function syncPayrollResults(PayrollResults: PayrollResult[]) {
  for (const result of PayrollResults) {
    if (!result._id) continue;
    try {
      await upsertPayrollResult(result);
      await markPayrollResultSynced(result._id);
    } catch (error) {
      console.error(
        "FAILED TO SYNC PULLED PAYROLL RESULTS:",
        result._id,
        error
      );
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
