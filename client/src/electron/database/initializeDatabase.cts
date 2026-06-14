import { createEmployeeTable } from "./schemas/employee.schema.cjs";
import { createAttendanceTable } from "./schemas/attendance.schema.cjs";
import { createLeaveTable } from "./schemas/leave.schema.cjs";
import { createOfflineUsersTable } from "./schemas/offline_users.schema.cjs";

export async function initializeDatabase() {
  await createEmployeeTable();
  await createAttendanceTable();
  await createLeaveTable();
  await createOfflineUsersTable();
  console.log("Database initialized");
}
