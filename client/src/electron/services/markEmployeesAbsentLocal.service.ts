import { randomUUID } from "crypto";
import { getEmployeesWhoDidNotClockIn } from "../database/repositories/attendances.repository.js";
import { createAbsentAttendance } from "../database/repositories/attendances.repository.js";
import Employee from "../../common/types/Employee.js";

export async function markEmployeesAbsentLocally() {
  const d = new Date();
  const date = d.toISOString().split("T")[0];
  const now = d.toISOString();

  // Employees who:
  // 1. Are active
  // 2. Have not clocked in today
  // 3. Are not on leave today
  const employees: Employee[] = await getEmployeesWhoDidNotClockIn(date);

  const createdAttendances = [];

  for (const employee of employees) {
    const absentAttendance = {
      _id: randomUUID(),
      employeeId: employee?._id,
      date,
      status: "ABSENT" as const,
      source: "AUTO_CLIENT" as const,
      createdAt: now,
      updatedAt: now,
    };

    const savedAttendance = await createAbsentAttendance(absentAttendance);

    createdAttendances.push(savedAttendance);
  }

  return createdAttendances;
}
