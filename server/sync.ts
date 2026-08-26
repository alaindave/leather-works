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
  serverVersion?: number;
  updatedAt?: Date | string;
  lastSyncedAt?: Date | string;
  synced?: number | boolean;
  [key: string]: any;
}

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

function cleanSyncFields(data: SyncData) {
  const {
    _id,
    serverVersion: _clientServerVersion,
    lastSyncedAt: _clientLastSyncedAt,
    synced: _clientSynced,
    ...fields
  } = data;

  delete fields._id;
  delete fields.serverVersion;
  delete fields.lastSyncedAt;
  delete fields.synced;

  return {
    _id,
    fields,
  };
}

function requireUpdatedAt(data: SyncData): Date {
  if (!data.updatedAt) {
    throw new Error(
      `SYNC FAILED: updatedAt is required for entity ${data._id}`
    );
  }

  const updatedAt = new Date(data.updatedAt);

  if (Number.isNaN(updatedAt.getTime())) {
    throw new Error(`SYNC FAILED: invalid updatedAt for entity ${data._id}`);
  }

  return updatedAt;
}

async function getServerVersion(entity: string): Promise<number> {
  return getNextSyncVersion(entity);
}

// ============================================================
// EMPLOYEE
// ============================================================

export async function syncEmployee(operation: SyncOperation, data: SyncData) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("employee");

  await Employee.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
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
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    employee,
  };
}

// ============================================================
// ATTENDANCE
// ============================================================
export async function syncAttendance(operation: SyncOperation, data: SyncData) {
  const { _id, fields } = cleanSyncFields(data);

  if (!_id) {
    throw new Error("ATTENDANCE SYNC FAILED: MISSING _id");
  }

  if (!fields.employeeId) {
    throw new Error("ATTENDANCE SYNC FAILED: MISSING employeeId");
  }

  if (!fields.date) {
    throw new Error("ATTENDANCE SYNC FAILED: MISSING date");
  }

  const serverVersion = await getServerVersion("attendance");

  const existingAttendance = await Attendance.findOne({
    employeeId: fields.employeeId,
    date: fields.date,
  });
  // Check if attendance record exist but with different _id
  if (existingAttendance && existingAttendance._id.toString() !== _id) {
    await Attendance.updateOne(
      {
        _id: existingAttendance._id,
      },
      {
        $set: {
          ...fields,
          serverVersion,
        },
      }
    );

    const attendance = await Attendance.findById(existingAttendance._id).lean();

    console.log("ATTENDANCE MERGED BY EMPLOYEE + DATE:", {
      clientId: _id,
      serverId: existingAttendance._id,
      employeeId: fields.employeeId,
      date: fields.date,
      serverVersion,
    });

    return {
      success: true,
      _id: existingAttendance._id,
      clientId: _id,
      serverVersion,
      attendance,
      merged: true,
    };
  }

  await Attendance.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const attendance = await Attendance.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} ATTENDANCE:`, {
    _id,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    attendance,
    merged: false,
  };
}

// ============================================================
// ATTENDANCE DAILY CHECK
// ============================================================

export async function syncAttendanceDailyCheck(
  operation: SyncOperation,
  data: SyncData
) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("attendance_daily_check");

  await AttendanceDailyCheck.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const attendanceDailyCheck = await AttendanceDailyCheck.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} ATTENDANCE DAILY CHECK:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    attendanceDailyCheck,
  };
}

// ============================================================
// LEAVE
// ============================================================

export async function syncLeave(operation: SyncOperation, data: SyncData) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("leave");

  await Leave.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const leave = await Leave.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} LEAVE:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    leave,
  };
}

// ============================================================
// TASK
// ============================================================

export async function syncTask(operation: SyncOperation, data: SyncData) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("task");

  await Task.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const task = await Task.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} TASK:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    task,
  };
}

// ============================================================
// TASK COMMENTS
// ============================================================

export async function syncTaskComment(
  operation: SyncOperation,
  data: SyncData
) {
  if (!data._id) {
    throw new Error("TASK COMMENT SYNC FAILED: MISSING _id");
  }

  if (!data.taskId) {
    throw new Error(`TASK COMMENT ${data._id} SYNC FAILED: MISSING taskId`);
  }

  requireUpdatedAt(data);

  const task = await Task.findById(data.taskId);

  if (!task) {
    throw new Error(`TASK ${data.taskId} NOT FOUND`);
  }

  console.log("TASK COMMENT DATA:", data);

  const commentServerVersion = await getServerVersion("task_comment");

  switch (operation) {
    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

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
          createdAt: new Date(data.createdAt).toISOString(),
          updatedAt: data.updatedAt && new Date(data.updatedAt).toISOString(),
          serverVersion: commentServerVersion,
          isDeleted: data.isDeleted ?? 0,
        } as any);
      } else {
        const existingUpdatedAt = existingComment.updatedAt
          ? new Date(existingComment.updatedAt).getTime()
          : 0;

        const incomingUpdatedAt = new Date(data.updatedAt as string).getTime();

        if (incomingUpdatedAt >= existingUpdatedAt) {
          Object.assign(existingComment, {
            author: data.author,
            comment: data.comment,
            isDeleted: data.isDeleted ?? existingComment.isDeleted ?? 0,
            updatedAt: data.updatedAt && new Date(data.updatedAt).toISOString(),
            serverVersion: commentServerVersion,
          });
        }
      }

      break;
    }

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    case "update": {
      const comment = task.comments.find((c) => c._id === data._id);

      if (!comment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      const existingUpdatedAt = comment.updatedAt
        ? new Date(comment.updatedAt).getTime()
        : 0;

      const incomingUpdatedAt = new Date(data.updatedAt as string).getTime();

      /*
       * Only apply the incoming version if it is newer.
       */
      if (incomingUpdatedAt >= existingUpdatedAt) {
        Object.assign(comment, {
          comment: data.comment,
          author: data.author,
          isDeleted: data.isDeleted ?? comment.isDeleted ?? 0,
          updatedAt: new Date(data.updatedAt as string),
          serverVersion: commentServerVersion,
        });
      }

      break;
    }

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    case "delete": {
      const deletedComment = task.comments.find((c) => c._id === data._id);

      if (!deletedComment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      const existingUpdatedAt = deletedComment.updatedAt
        ? new Date(deletedComment.updatedAt).getTime()
        : 0;

      const incomingUpdatedAt = new Date(data.updatedAt as string).getTime();

      /*
       * Only apply the delete if this delete represents a newer
       * version of the comment.
       */
      if (incomingUpdatedAt >= existingUpdatedAt) {
        deletedComment.isDeleted = 1;

        /*
         * Preserve the client's delete timestamp.
         */
        deletedComment.updatedAt = new Date(data.updatedAt as string);

        (deletedComment as any).serverVersion = commentServerVersion;
      }

      break;
    }
  }

  /*
   * A task changed because one of its comments changed.
   *
   * Therefore the parent task receives a new serverVersion.
   *
   * IMPORTANT:
   *
   * We DO NOT do:
   *
   * task.updatedAt = new Date()
   *
   * because updatedAt represents the actual client-side
   * modification timestamp.
   *
   * The comment itself has its own updatedAt.
   *
   * The parent task receives a new serverVersion because the
   * server representation of the task has changed.
   */
  const taskServerVersion = await getServerVersion("task");

  task.serverVersion = taskServerVersion;

  await task.save();

  const savedTask = await Task.findById(data.taskId);

  const savedComment = savedTask?.comments.find(
    (comment) => comment._id === data._id
  );

  console.log("SYNCED TASK COMMENT:", {
    taskId: data.taskId,
    commentId: data._id,
    commentUpdatedAt: data.updatedAt,
    commentServerVersion,
    taskServerVersion,
  });

  return {
    success: true,
    taskId: data.taskId,
    commentId: data._id,
    commentServerVersion,
    serverVersion: taskServerVersion,
    comment: savedComment,
  };
}

// ============================================================
// USER NOTES / ADMIN USER
// ============================================================

export async function syncUserNotes(data: SyncData) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("admin_user");

  await AdminUser.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  console.log("SYNCED USER NOTES:", {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
  };
}

// ============================================================
// EMPLOYEE PHOTO
// ============================================================

export async function syncEmployeePhoto(data: SyncData, file?: UploadedFile) {
  requireUpdatedAt(data);

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

  /*
   * A photo change is an employee change.
   *
   * The employee's updatedAt comes from the client.
   * The employee's serverVersion comes from the server.
   */
  const serverVersion = await getServerVersion("employee");

  Object.assign(employee, {
    photo_filename: data.photo_filename,
    photo_path: objectPath,
    photo_hash: data.photo_hash,
    photo_mime_type: data.photo_mime_type,

    photo_last_modified: data.photo_last_modified
      ? new Date(data.photo_last_modified)
      : new Date(data.updatedAt as string),

    photo_version: data.photo_version,

    /*
     * IMPORTANT:
     * Preserve client-side updatedAt.
     */
    updatedAt: new Date(data.updatedAt as string),

    serverVersion,
  });

  await employee.save();

  return {
    success: true,
    employeeId: employee._id,
    serverVersion,
    updatedAt: employee.updatedAt,
  };
}

// ============================================================
// EMPLOYEE DOCUMENTS
// ============================================================

export async function syncEmployeeDocument(
  operation: SyncOperation,
  data: SyncData,
  file?: UploadedFile
) {
  requireUpdatedAt(data);

  const employee = await Employee.findById(data.employeeId);

  if (!employee) {
    throw new Error("EMPLOYEE NOT FOUND");
  }

  const serverVersion = await getServerVersion("employee_document");

  switch (operation) {
    // --------------------------------------------------------
    // CREATE / UPDATE
    // --------------------------------------------------------

    case "create":
    case "update": {
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

      const { _id, fields } = cleanSyncFields(data);

      await EmployeesDocuments.updateOne(
        {
          _id,
        },
        {
          $set: {
            ...fields,

            storagePath: objectPath,

            /*
             * Preserve client-side entity timestamp.
             */
            updatedAt: new Date(data.updatedAt as string),

            /*
             * Server-owned version.
             */
            serverVersion,
          },

          $setOnInsert: {
            _id,
          },
        },
        {
          upsert: true,
        }
      );

      return {
        success: true,
        _id,
        serverVersion,
        updatedAt: data.updatedAt,
      };
    }

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    case "delete": {
      await EmployeesDocuments.updateOne(
        {
          _id: data._id,
        },
        {
          $set: {
            isDeleted: 1,

            /*
             * Preserve client-side delete timestamp.
             */
            updatedAt: new Date(data.updatedAt as string),

            serverVersion,
          },
        }
      );

      return {
        success: true,
        _id: data._id,
        serverVersion,
        updatedAt: data.updatedAt,
      };
    }
  }
}

// ============================================================
// PAYROLL SETTINGS
// ============================================================

export async function syncPayrollSettings(
  operation: SyncOperation,
  data: SyncData
) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("payroll_settings");

  await PayrollSettings.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const settings = await PayrollSettings.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} PAYROLL SETTINGS:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    settings,
  };
}

// ============================================================
// PAYROLL COMPONENT
// ============================================================

export async function syncPayrollComponent(
  operation: SyncOperation,
  data: SyncData
) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("payroll_component");

  await PayrollComponent.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const component = await PayrollComponent.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} PAYROLL COMPONENT:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    component,
  };
}

// ============================================================
// PAYROLL PROFILE
// ============================================================

export async function syncPayrollProfile(
  operation: SyncOperation,
  data: SyncData
) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  if (!_id) {
    throw new Error("PAYROLL PROFILE SYNC FAILED: MISSING _id");
  }

  const serverVersion = await getServerVersion("payroll_profile");

  await EmployeePayrollProfile.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
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

  console.log(`SYNCED ${operation.toUpperCase()} PAYROLL PROFILE:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    profile,
  };
}

// ============================================================
// PAYROLL RUN
// ============================================================

export async function syncPayrollRun(operation: SyncOperation, data: SyncData) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("payroll_run");

  await PayrollRun.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const payrollRun = await PayrollRun.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} PAYROLL RUN:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    payrollRun,
  };
}

// ============================================================
// PAYROLL RESULT
// ============================================================

export async function syncPayrollResult(
  operation: SyncOperation,
  data: SyncData
) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("payroll_result");

  await PayrollResult.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const result = await PayrollResult.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} PAYROLL RESULT:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    result,
  };
}

// ============================================================
// PAYROLL ITEM
// ============================================================

export async function syncPayrollItem(
  operation: SyncOperation,
  data: SyncData
) {
  requireUpdatedAt(data);

  const { _id, fields } = cleanSyncFields(data);

  const serverVersion = await getServerVersion("payroll_item");

  await PayrollItem.updateOne(
    {
      _id,
    },
    {
      $set: {
        ...fields,
        serverVersion,
      },
      $setOnInsert: {
        _id,
      },
    },
    {
      upsert: true,
    }
  );

  const item = await PayrollItem.findById(_id).lean();

  console.log(`SYNCED ${operation.toUpperCase()} PAYROLL ITEM:`, {
    _id,
    updatedAt: data.updatedAt,
    serverVersion,
  });

  return {
    success: true,
    _id,
    serverVersion,
    item,
  };
}
