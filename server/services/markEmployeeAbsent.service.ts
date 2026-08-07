import { randomUUID } from "crypto";

import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModel.js";

export async function markAbsentEmployees() {
  const CURRENT_TIMESTAMP = new Date();
  const date = CURRENT_TIMESTAMP.toISOString().split("T")[0];

  const employees = await Employee.find({
    status: "ACTIF",
  });

  console.log("FETCHED ACTIVE EMPLOYEES", employees);

  if (employees.length === 0) {
    return {
      date,
      totalEmployees: 0,
      created: 0,
      alreadyExists: 0,
    };
  }

  const operations = employees.map((employee) => ({
    updateOne: {
      filter: {
        employeeId: employee._id,
        date,
      },
      update: {
        $setOnInsert: {
          _id: randomUUID(),
          employeeId: employee._id,
          date,
          status: "ABSENT" as const,
          source: "AUTO_SERVER" as const,
          createdAt: CURRENT_TIMESTAMP,
          updatedAt: CURRENT_TIMESTAMP,
        },
      },
      upsert: true,
    },
  }));

  const result = await Attendance.bulkWrite(operations);

  const created = result.upsertedCount;
  const alreadyExists = employees.length - created;

  return {
    date,
    totalEmployees: employees.length,
    created,
    alreadyExists,
  };
}
