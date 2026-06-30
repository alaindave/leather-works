const Employee = require("./models/employeeModel.js");
const Attendance = require("./models/attendanceModel.js");
const Leave = require("./models/leaveModel.js");
const Task = require("./models/taskModel.js");
const { AdminUser } = require("./models/adminUserModel.js");

async function syncEmployee(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      const employee = await Employee.updateOne({ _id: data._id }, data, {
        upsert: true,
      });

      console.log("Employee create/update synced in Mongo:", employee);
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

async function syncAttendance(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      console.log("Attendance to sync to server:", data);
      await Attendance.updateOne({ _id: data._id }, data, { upsert: true });
      break;

    case "delete":
      await Attendance.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      break;
  }
}

async function syncLeave(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      await Leave.updateOne({ _id: data._id }, data, { upsert: true });
      break;

    case "delete":
      await Leave.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      break;
  }
}

async function syncTask(operation, data) {
  switch (operation) {
    case "create":
    case "update":
      await Task.updateOne({ _id: data._id }, data, { upsert: true });
      break;

    case "delete":
      await Task.updateOne(
        { _id: data._id },
        { isDeleted: 1, updatedAt: new Date() }
      );
      break;
  }
}

async function syncUserNotes(data) {
  await AdminUser.updateOne({ _id: data._id }, data, { upsert: true });
}

module.exports = {
  syncEmployee,
  syncAttendance,
  syncLeave,
  syncTask,
  syncUserNotes,
};
