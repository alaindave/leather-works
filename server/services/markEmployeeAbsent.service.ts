import { randomUUID } from "crypto";

import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModel.js";

export async function markAbsentEmployees(): Promise<void> {
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
      const absentAttendance = await Attendance.create({
        _id: randomUUID(),
        employeeId: employee._id,
        date,
        status: "ABSENT",
        source: "AUTOMATIC",
        createdAt: CURRENT_TIMESTAMP,
        updatedAt: CURRENT_TIMESTAMP,
      });

      console.log("ABSENT ATTENDANCE CREATED:", absentAttendance);
    }
  }
}
