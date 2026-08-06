import Employee from "./models/employeeModel.js";
import Attendance from "./models/attendanceModel.js";
import Leave from "./models/leaveModel.js";
import Task from "./models/taskModel.js";
import EmployeesDocuments from "./models/employeesDocumentsModel.js";
import PayrollComponent from "./models/payrollComponentModel.js";
import AdminUser from "./models/adminUserModel.js";
import EmployeePayrollProfile from "./models/payrollEmployeeProfileModel.js";
import supabase from "./services/supabase.service.js";

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

export async function syncEmployee(
  operation: SyncOperation,
  data: SyncData
): Promise<void> {
  switch (operation) {
    case "create":
    case "update":
      await Employee.updateOne({ _id: data._id }, data, {
        upsert: true,
      });

      console.log("SYNCED EMPLOYEE:", await Employee.findById(data._id));

      break;

    case "delete":
      await Employee.updateOne(
        {
          _id: data._id,
        },
        {
          isDeleted: 1,
          updatedAt: new Date(),
        }
      );

      console.log(
        "SYNCED DELETED EMPLOYEE:",
        await Employee.findById(data._id)
      );

      break;
  }
}

// ================= ATTENDANCE =================

export async function syncAttendance(operation: SyncOperation, data: SyncData) {
  switch (operation) {
    case "create":
    case "update":
      await Attendance.updateOne(
        {
          _id: data._id,
        },
        data,
        {
          upsert: true,
        }
      );

      console.log("SYNCED ATTENDANCE:", await Attendance.findById(data._id));

      break;

    case "delete":
      await Attendance.updateOne(
        {
          _id: data._id,
        },
        {
          isDeleted: 1,
          updatedAt: new Date(),
        }
      );

      console.log(
        "SYNCED DELETED ATTENDANCE:",
        await Attendance.findById(data._id)
      );

      break;
  }
}

// ================= LEAVE =================

export async function syncLeave(operation: SyncOperation, data: SyncData) {
  switch (operation) {
    case "create":
    case "update":
      await Leave.updateOne(
        {
          _id: data._id,
        },
        data,
        {
          upsert: true,
        }
      );

      console.log("SYNCED LEAVE:", await Leave.findById(data._id));

      break;

    case "delete":
      await Leave.updateOne(
        {
          _id: data._id,
        },
        {
          isDeleted: 1,
          updatedAt: new Date(),
        }
      );

      console.log("SYNCED DELETED LEAVE:", await Leave.findById(data._id));

      break;
  }
}

// ================= TASK =================

export async function syncTask(operation: SyncOperation, data: SyncData) {
  switch (operation) {
    case "create":
    case "update":
      await Task.updateOne(
        {
          _id: data._id,
        },
        data,
        {
          upsert: true,
        }
      );

      console.log("SYNCED TASK:", await Task.findById(data._id));

      break;

    case "delete":
      await Task.updateOne(
        {
          _id: data._id,
        },
        {
          isDeleted: 1,
          updatedAt: new Date(),
        }
      );

      console.log("SYNCED DELETED TASK:", await Task.findById(data._id));

      break;
  }
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

  switch (operation) {
    case "create":
      if (!task.comments.some((comment) => comment._id === data._id)) {
        task.comments.push(data as any);
      }

      console.log("SYNCED TASK COMMENT:", await Task.findById(data._id));

      break;

    case "update":
      const comment = task.comments.find((c) => c._id === data._id);

      if (!comment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      Object.assign(comment, data);

      break;

    case "delete":
      const deletedComment = task.comments.find((c) => c._id === data._id);

      if (!deletedComment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      deletedComment.isDeleted = 1;
      deletedComment.updatedAt = new Date();

      break;
  }

  task.updatedAt = new Date(data.updatedAt as string);

  await task.save();
}

// ================= USER NOTES =================

export async function syncUserNotes(data: SyncData) {
  await AdminUser.updateOne(
    {
      _id: data._id,
    },
    data,
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

// ================= PAYROLL =================

export async function syncPayrollComponent(
  operation: SyncOperation,
  data: SyncData
) {
  if (operation === "delete") {
    await PayrollComponent.updateOne(
      {
        _id: data._id,
      },
      {
        isDeleted: 1,
        updatedAt: new Date(),
      }
    );

    return;
  }

  await PayrollComponent.updateOne(
    {
      _id: data._id,
    },
    data,
    {
      upsert: true,
    }
  );
}

export async function syncPayrollProfile(
  operation: SyncOperation,
  data: SyncData
) {
  await EmployeePayrollProfile.updateOne(
    {
      _id: data._id,
    },
    {
      $set: data,
    },
    {
      upsert: true,
    }
  );
}
