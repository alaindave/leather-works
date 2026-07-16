const Employee = require("../models/employeeModel");
const Attendance = require("../models/attendanceModel");
const { randomUUID } = require("crypto");

async function markAbsentEmployees() {
  const now = new Date();
  const CURRENT_TIMESTAMP = now.toISOString();
  const date = now.toISOString().split("T")[0];

  const employees = await Employee.find({
    status: "ACTIF",
  });

  for (const employee of employees) {
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date,
      isDeleted: 0,
    });

    if (!attendance) {
      const absent_attendance = await Attendance.create({
        _id: randomUUID(),
        employeeId: employee._id,
        date,
        status: "ABSENT",
        source: "AUTOMATIC",
        createdAt: CURRENT_TIMESTAMP,
        updatedAt: CURRENT_TIMESTAMP,
      });

      console.log("ABSENT ATTENDANCE CREATED:", absent_attendance);
    }
  }
}

module.exports = {
  markAbsentEmployees,
};
