import Employee from "./models/employee.model.js";
import Attendance from "./models/attendance.model.js";
import Leave from "./models/leave.model.js";
import Task from "./models/task.model.js";
import EmployeesDocuments from "./models/employeesDocuments.model.js";
import PayrollComponent from "./models/payrollComponent.model.js";
import AdminUser from "./models/adminUser.model.js";
import EmployeePayrollProfile from "./models/payrollEmployeeProfile.model.js";
import supabase from "./services/supabase.service.js";
import PayrollRun from "./models/payrollRun.model.js";
import PayrollResult from "./models/payrollResult.model.js";
import PayrollItem from "./models/payrollItem.model.js";
import PayrollSettings from "./models/payrollSettings.model.js";
import AttendanceDailyCheck from "./models/attendanceDailyCheck.model.js";
import { getNextSyncVersion } from "./utils/syncVersion.js";

export type SyncOperation = "create" | "update" | "delete";

interface SyncData {
  _id: string;
  updatedAt?: Date | string;
  [key: string]: any;
}

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

// ================= EMPLOYEE =================

export async function syncEmployee(operation: SyncOperation, data: SyncData) {
  const { _id, serverVersion, ...fields } = data;

  // Server is the only authority that generates the version.
  const version = await getNextSyncVersion("employee");

  await Employee.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion: version,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const employee = await Employee.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} EMPLOYEE:`, {
    _id,
    serverVersion: version,
    employee,
  });

  return {
    success: true,
    _id,
    serverVersion: version,
  };
}
// ================= ATTENDANCE =================

export async function syncAttendance(operation: SyncOperation, data: SyncData) {
  const { _id, ...fields } = data;

  await Attendance.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: { _id },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} ATTENDANCE:`,
    await Attendance.findById(data._id)
  );
}

// ================= ATTENDANCE DAILY CHECK =================

export async function syncAttendanceDailyCheck(
  operation: SyncOperation,
  data: SyncData
) {
  const { _id, ...fields } = data;
  await AttendanceDailyCheck.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: { _id },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} ATTENDANCE DAILY CHECK:`,
    await AttendanceDailyCheck.findById(data._id)
  );
}

// ================= LEAVE =================
export async function syncLeave(operation: SyncOperation, data: SyncData) {
  const { _id, ...fields } = data;

  await Leave.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: { _id },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} LEAVE:`,
    await Leave.findById(data._id)
  );
}

// ================= TASK =================

export async function syncTask(operation: SyncOperation, data: SyncData) {
  const { _id, ...fields } = data;

  await Task.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: { _id },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} TASK:`,
    await Task.findById(data._id)
  );
}

// ================= TASK COMMENTS =================
export async function syncTaskComment(
  operation: SyncOperation,
  data: SyncData
) {
  const task = await Task.findById(data.taskId);

  if (!task) {
    throw new Error(`TASK ${data.taskId} NOT FOUND`);
  }

  console.log("TASK COMMENT DATA:", data);

  switch (operation) {
    case "create": {
      const existingComment = task.comments.find(
        (comment) => comment._id === data._id
      );

      if (!existingComment) {
        task.comments.push({
          _id: data._id,
          taskId: data.taskId,
          author: data.author,
          comment: data.comment,
          createdAt: data.createdAt
            ? new Date(data.createdAt as string)
            : new Date(),
          updatedAt: data.updatedAt
            ? new Date(data.updatedAt as string)
            : new Date(),
          isDeleted: data.isDeleted ?? 0,
        } as any);
      }

      break;
    }

    case "update": {
      const comment = task.comments.find((c) => c._id === data._id);

      if (!comment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      Object.assign(comment, {
        ...data,
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt as string)
          : new Date(),
      });

      break;
    }

    case "delete": {
      const deletedComment = task.comments.find((c) => c._id === data._id);

      if (!deletedComment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      deletedComment.isDeleted = 1;
      deletedComment.updatedAt = new Date();

      break;
    }
  }

  task.updatedAt = data.updatedAt
    ? new Date(data.updatedAt as string)
    : new Date();

  await task.save();

  const savedTask = await Task.findById(data.taskId);

  const savedComment = savedTask?.comments.find(
    (comment) => comment._id === data._id
  );

  console.log("SYNCED TASK COMMENT:", savedComment);
}

// ================= USER NOTES =================

export async function syncUserNotes(data: SyncData) {
  const { _id, ...fields } = data;

  await AdminUser.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );
}

// ================= EMPLOYEE PHOTO =================

export async function syncEmployeePhoto(data: SyncData, file?: UploadedFile) {
  const employee = await Employee.findById(data.employeeId);

  if (!employee) {
    throw new Error(`EMPLOYEE ${data.employeeId} NOT FOUND`);
  }

  if (!file) {
    throw new Error("PHOTO FILE MISSING");
  }

  const employeeFolderName =
    `${employee.firstName}_${employee.lastName}_${employee._id}`
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_");

  const objectPath = `${employeeFolderName}/photo`;

  const { error } = await supabase.storage
    .from("afritan_employees_photos")
    .upload(objectPath, file.buffer, {
      contentType: data.photo_mime_type,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  Object.assign(employee, {
    photo_filename: data.photo_filename,
    photo_path: objectPath,
    photo_hash: data.photo_hash,
    photo_mime_type: data.photo_mime_type,
    photo_last_modified: new Date(data.photo_last_modified),
    photo_version: data.photo_version,
    updatedAt: data.updatedAt,
  });

  return employee.save();
}

// ================= DOCUMENTS =================

export async function syncEmployeeDocument(
  operation: SyncOperation,
  data: SyncData,
  file?: UploadedFile
) {
  const employee = await Employee.findById(data.employeeId);

  if (!employee) {
    throw new Error("EMPLOYEE NOT FOUND");
  }

  switch (operation) {
    case "create":
    case "update":
      if (!file) {
        throw new Error("DOCUMENT FILE MISSING");
      }

      const objectPath = `${employee.firstName}_${employee.lastName}_${employee._id}/${data.documentType}`;

      const { error } = await supabase.storage
        .from("afritan_employees_documents")
        .upload(objectPath, file.buffer, {
          contentType: data.mimeType,
          upsert: true,
        });

      if (error) {
        throw error;
      }

      return EmployeesDocuments.updateOne(
        {
          _id: data._id,
        },
        {
          ...data,
          storagePath: objectPath,
        },
        {
          upsert: true,
        }
      );

    case "delete":
      await EmployeesDocuments.updateOne(
        {
          _id: data._id,
        },
        {
          isDeleted: 1,
          updatedAt: new Date(),
        }
      );

      break;
  }
}

// ================= PAYROLL SETTINGS =================

export async function syncPayrollSettings(
  operation: SyncOperation,
  data: SyncData
) {
  const { _id, ...fields } = data;
  await PayrollSettings.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} PAYROLL SETTINGS:`,
    await PayrollSettings.findById(data._id)
  );
}

// ================= PAYROLL COMPONENT =================
export async function syncPayrollComponent(
  operation: SyncOperation,
  data: SyncData
) {
  const { _id, ...fields } = data;
  await PayrollComponent.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} PAYROLL COMPONENT:`,
    await PayrollComponent.findById(data._id)
  );
}

// ================= PAYROLL PROFILE =================
export async function syncPayrollProfile(
  operation: SyncOperation,
  data: SyncData
) {
  const { _id, ...fields } = data;

  if (!_id) {
    throw new Error("PAYROLL PROFILE SYNC FAILED: MISSING _id");
  }

  await EmployeePayrollProfile.updateOne(
    {
      _id,
    },
    {
      $set: fields,
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const profile = await EmployeePayrollProfile.findById(_id);

  if (!profile) {
    throw new Error(`PAYROLL PROFILE WAS NOT FOUND AFTER UPSERT: ${_id}`);
  }

  console.log(`SYNCED ${operation.toUpperCase()} PAYROLL PROFILE:`, profile);

  return profile;
}

// Sync payroll run
export async function syncPayrollRun(operation: SyncOperation, data: SyncData) {
  const { _id, ...fields } = data;
  await PayrollRun.updateOne(
    {
      _id: data._id,
    },
    {
      $set: fields,
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} PAYROLL RUN:`,
    await PayrollRun.findById(data._id)
  );
}

// Sync payroll result
export async function syncPayrollResult(
  operation: SyncOperation,
  data: SyncData
) {
  const { _id, ...fields } = data;
  await PayrollResult.updateOne(
    {
      _id,
    },
    {
      $set: fields,
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  console.log(
    `SYNCED ${operation.toUpperCase()} PAYROLL RESULT:`,
    await PayrollResult.findById(data._id)
  );
}

// Sync payroll item
export async function syncPayrollItem(
  operation: SyncOperation,
  data: SyncData
) {
  const { _id, ...fields } = data;
  await PayrollItem.updateOne(
    {
      _id,
    },
    {
      $set: fields,
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );
  console.log(
    `SYNCED ${operation.toUpperCase()} PAYROLL ITEM:`,
    await PayrollItem.findById(data._id)
  );
}
