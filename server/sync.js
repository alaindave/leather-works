const Employee = require("./models/employeeModel.js");
const Attendance = require("./models/attendanceModel.js");
const Leave = require("./models/leaveModel.js");
const Task = require("./models/taskModel.js");
const EmployeesDocuments = require("./models/employeesDocumentsModel.js");
const PayrollComponent = require("./models/payrollComponentModel.js");
const { AdminUser } = require("./models/adminUserModel.js");
const fs = require("fs/promises");
const path = require("path");
const supabase = require("./services/supabase.service.js");

//sync employees
async function syncEmployee(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      console.log("EMPLOYEE TO SYNC IN MONGO DB:", data);
      await Employee.updateOne({ _id: data._id }, data, {
        upsert: true,
      });
      const updated = await Employee.findById(data._id);
      console.log("SYNCED EMPLOYEE:", updated);
      break;

    case "delete":
      const deletedEmployee = await Employee.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      console.log("Employee deletion synced in Mongo:", deletedEmployee);

      break;
  }
}

//sync attendances
async function syncAttendance(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      console.log("ATTENDANCE TO SYNC TO SERVERr:", data);
      await Attendance.updateOne({ _id: data._id }, data, { upsert: true });
      const updated = await Attendance.findById(data._id);
      console.log("SYNCED ATTENDANCE:", updated);
      break;

    case "delete":
      await Attendance.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      break;
  }
}

//sync leaves
async function syncLeave(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      console.log("LEAVE TO SYNC TO SERVER:", data);
      await Leave.updateOne({ _id: data._id }, data, {
        upsert: true,
      });
      const updated = await Leave.findById(data._id);
      console.log("SYNCED LEAVE TO SERVER:", updated);
      break;

    case "delete":
      await Leave.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      break;
  }
}

//sync tasks
async function syncTask(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      console.log("TASK TO SYNC TO SERVER:", data);
      await Task.updateOne({ _id: data._id }, data, {
        upsert: true,
      });
      const updated = await Task.findById(data._id);
      console.log("SYNCED TASK:", updated);
      break;

    case "delete":
      await Task.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      break;
  }
}

// sync task comments
async function syncTaskComment(operation, data) {
  console.log("TASK COMMENT TO SYNC:", data);

  const task = await Task.findById(data.taskId);

  if (!task) {
    throw new Error(`TASK ${data.taskId} NOT FOUND`);
  }

  switch (operation) {
    case "create": {
      const exists = task.comments.some((comment) => comment._id === data._id);

      if (!exists) {
        task.comments.push(data);
      }

      break;
    }

    case "update": {
      const comment = task.comments.find((comment) => comment._id === data._id);

      if (!comment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      comment.author = data.author;
      comment.comment = data.comment;
      comment.updatedAt = data.updatedAt;
      comment.isDeleted = data.isDeleted;

      break;
    }

    case "delete": {
      const comment = task.comments.find((comment) => comment._id === data._id);

      if (!comment) {
        throw new Error(`COMMENT ${data._id} NOT FOUND`);
      }

      // Soft delete
      comment.isDeleted = 1;
      comment.updatedAt = new Date();

      break;
    }

    default:
      throw new Error(`UNSUPPORTED OPERATION: ${operation}`);
  }

  task.updatedAt = new Date(data.updatedAt);
  await task.save();
  console.log("SYNCED TASK COMMENT:", data._id);

  return task;
}

//sync user notes
async function syncUserNotes(data) {
  console.log("USER NOTES TO SYNC TO SERVER:", data);
  await AdminUser.updateOne({ _id: data._id }, data, { upsert: true });
  const updated = await AdminUser.findById(data._id);
  console.log("SYNCED NOTES:", updated);
}

//Sync employee photos
async function syncEmployeePhoto(data, file) {
  const employee = await Employee.findById(data.employeeId);

  console.log("PHOTO METADATA:", data);
  console.log("PHOTO FILE:", file);

  if (!employee) {
    throw new Error(`EMPLOYEE ${data.employeeId} NOT FOUND`);
  }

  if (!file) {
    throw new Error("PHOTO FILE MISSING");
  }

  // subfolder name
  const employeeFolderName =
    `${employee.firstName}_${employee.lastName}_${employee._id}`
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_");

  const objectPath = `${employeeFolderName}/photo`;

  // Upload photo to Supabase Storage
  const { error } = await supabase.storage
    .from("afritan_employees_photos")
    .upload(objectPath, file.buffer, {
      contentType: data.photo_mime_type,
      upsert: true,
    });

  if (error) {
    throw new Error(`SUPABASE UPLOAD FAILED: ${error.message}`);
  }

  //Update photo metadata
  employee.photo_filename = data.photo_filename;
  employee.photo_path = objectPath;
  employee.photo_hash = data.photo_hash;
  employee.photo_mime_type = data.photo_mime_type;
  employee.photo_last_modified = new Date(data.photo_last_modified);
  employee.photo_version = data.photo_version;
  employee.updatedAt = data.updatedAt;

  await employee.save();

  return employee;
}

// Sync employee documents
async function syncEmployeeDocument(operation, data, file) {
  console.log("DOCUMENT METADATA:", data);
  console.log("DOCUMENT FILE:", file);

  const employee = await Employee.findById(data.employeeId);

  switch (operation) {
    case "create":
    case "update": {
      if (!file) {
        throw new Error("DOCUMENT FILE MISSING");
      }

      // Store each employee's documents in their own folder
      const objectPath = `${employee.firstName}_${employee.lastName}_${employee._id}/${data.documentType}`;

      // Upload document to Supabase Storage
      const { error } = await supabase.storage
        .from("afritan_employees_documents")
        .upload(objectPath, file.buffer, {
          contentType: data.mimeType,
          upsert: true,
        });

      if (error) {
        throw new Error(`SUPABASE UPLOAD FAILED: ${error.message}`);
      }

      await EmployeesDocuments.updateOne(
        { _id: data._id },
        {
          ...data,
          storagePath: objectPath,
        },
        {
          upsert: true,
        }
      );

      const updated = await EmployeesDocuments.findById(data._id);

      console.log("SYNCED EMPLOYEE DOCUMENT:", updated);

      return updated;
    }

    case "delete": {
      const existing = await EmployeesDocuments.findById(data._id);

      if (existing?.storagePath) {
        await supabase.storage
          .from("afritan_employees_documents")
          .remove([existing.storagePath]);
      }

      await EmployeesDocuments.updateOne(
        { _id: data._id },
        {
          isDeleted: 1,
          updatedAt: new Date(),
        }
      );

      break;
    }

    default:
      throw new Error(`UNSUPPORTED OPERATION: ${operation}`);
  }
}

//Sync payroll components
async function syncPayrollComponent(operation, data) {
  switch (operation) {
    case "CREATE":
      await PayrollComponent.updateOne(
        { _id: data._id },
        { $setOnInsert: data },
        { upsert: true }
      );
      break;

    case "UPDATE":
      await PayrollComponent.updateOne({ _id: data._id }, { $set: data });
      break;

    case "DELETE":
      await PayrollComponent.updateOne(
        { _id: data._id },
        {
          $set: {
            isDeleted: 1,
            updatedAt: new Date(),
          },
        }
      );
      break;
  }
}

module.exports = {
  syncEmployee,
  syncAttendance,
  syncLeave,
  syncTask,
  syncTaskComment,
  syncUserNotes,
  syncEmployeePhoto,
  syncEmployeeDocument,
  syncPayrollComponent,
};
