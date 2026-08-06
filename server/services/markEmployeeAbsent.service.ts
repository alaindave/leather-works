import { randomUUID } from "crypto";

import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModel.js";

export async function markAbsentEmployees() {
  const now = new Date();

  const CURRENT_TIMESTAMP = now.toISOString();
  const date = now.toISOString().split("T")[0];

  const employees = await Employee.find({
    status: "ACTIF",
  });

  let created = 0;
  let alreadyExists = 0;

  console.log("FETCHED ACTIVE EMPLOYEES", employees);

  for (const employee of employees) {
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date,
      isDeleted: 0,
    });

    console.log("FETCHED ACTIVE EMPLOYEES ATTENDANCE", attendance);

    if (attendance) {
      alreadyExists++;
      continue;
    }

    await Attendance.create({
      _id: randomUUID(),
      employeeId: employee._id,
      date,
      status: "ABSENT",
      source: "AUTO_SERVER",
      createdAt: CURRENT_TIMESTAMP,
      updatedAt: CURRENT_TIMESTAMP,
    });

    created++;
  }

  return {
    date,
    totalEmployees: employees.length,
    created,
    alreadyExists,
  };
}
