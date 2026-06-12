import { createEmployeeTable } from "./schemas/employee.schema.cjs";
import { createAttendanceTable } from "./schemas/attendance.schema.cjs";

export async function initializeDatabase() {
  await createEmployeeTable();
  await createAttendanceTable();
  console.log("Database initialized");
}
