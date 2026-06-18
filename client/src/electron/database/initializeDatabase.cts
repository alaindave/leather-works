import { createEmployeeTable } from "./schemas/employee.schema.cjs";
import { createAttendanceTable } from "./schemas/attendance.schema.cjs";
import { createLeaveTable } from "./schemas/leave.schema.cjs";
import { createOfflineUsersTable } from "./schemas/offline_users.schema.cjs";
import { createSyncTable } from "./schemas/sync.schema.cjs";
import { createSettingsTable } from "./schemas/settings.schema.cjs";

export async function initializeDatabase() {
  await createEmployeeTable();
  await createAttendanceTable();
  await createLeaveTable();
  await createOfflineUsersTable();
  await createSyncTable();
  await createSettingsTable();
  console.log("Database initialized");
}
