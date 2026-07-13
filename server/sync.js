const Employee = require("./models/employeeModel.js");
const Attendance = require("./models/attendanceModel.js");
const Leave = require("./models/leaveModel.js");
const Task = require("./models/taskModel.js");
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

//sync user notes
async function syncUserNotes(data) {
  console.log("USER NOTES TO SYNC TO SERVER:", data);
  await AdminUser.updateOne({ _id: data._id }, data, { upsert: true });
  const updated = await AdminUser.findById(data._id);
  console.log("SYNCED NOTES:", updated);
}

//sync employee photos
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

  // Store each employee's photos in their own folder
  const objectPath = `${employee._id}/${data.photo_filename}`;

  // Upload photo to Supabase Storage
  const { error } = await supabase.storage
    .from("afritan_employees_photos")
    .upload(objectPath, file.buffer, {
      contentType: data.photo_mime_type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  // Update photo metadata
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

module.exports = {
  syncEmployee,
  syncAttendance,
  syncLeave,
  syncTask,
  syncUserNotes,
  syncEmployeePhoto,
};
