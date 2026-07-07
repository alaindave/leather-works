const Employee = require("./models/employeeModel.js");
const Attendance = require("./models/attendanceModel.js");
const Leave = require("./models/leaveModel.js");
const Task = require("./models/taskModel.js");
const { AdminUser } = require("./models/adminUserModel.js");
const fs = require("fs/promises");
const path = require("path");
const { PHOTO_DIR } = require("./utils/employees_photos.js");

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
      console.log("UPDATED EMPLOYEE:", updated);
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
      console.log("Attendance to sync to server:", data);
      await Attendance.updateOne({ _id: data._id }, data, { upsert: true });
      const updated = await Attendance.findById(data._id);
      console.log("Updated attendance:", updated);
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
      console.log("Leave to sync to server:", data);
      await Leave.updateOne({ _id: data._id }, data, {
        upsert: true,
      });
      const updated = await Leave.findById(data._id);
      console.log("Updated leave:", updated);
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
      console.log("Task to sync to server:", data);
      await Task.updateOne({ _id: data._id }, data, {
        upsert: true,
      });
      const updated = await Task.findById(data._id);
      console.log("Updated task:", updated);
      break;

    case "delete":
      await Task.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      break;
  }
}

//sync user notes
async function syncUserNotes(data) {
  console.log("User notes to sync to server:", data);
  await AdminUser.updateOne({ _id: data._id }, data, { upsert: true });
  const updated = await AdminUser.findById(data._id);
  console.log("Updated admin user:", updated);
}

//sync employee photos
async function syncEmployeePhoto(data, file) {
  const employee = await Employee.findById(data.employeeId);
  console.log("PHOTO METADATA:", data);
  console.log("PHOTO FILE:", file);
  if (!employee) {
    throw new Error(`Employee ${data.employeeId} not found`);
  }

  if (!file) {
    throw new Error("PHOTO FILE MISSING");
  }

  const serverPath = path.join(PHOTO_DIR, data.photo_filename);

  await fs.writeFile(serverPath, file.buffer);

  employee.photo_filename = data.photo_filename;

  employee.photo_path = `/employee_photos/${data.photo_filename}`;

  employee.photo_hash = data.photo_hash;

  employee.photo_mime_type = data.photo_mime_type;

  employee.photo_last_modified = new Date(data.photo_last_modified);

  employee.photo_version = data.photo_version;

  await employee.save();

  return employee;
}

module.exports = {
  syncEmployee,
  syncAttendance,
  syncLeave,
  syncTask,
  syncUserNotes,
  syncEmployeePhoto,
};
