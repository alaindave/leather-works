import { createEmployeeTable } from "./schemas/employee.schema.js";
import { createAttendanceTable } from "./schemas/attendance.schema.js";
import { createLeaveTable } from "./schemas/leave.schema.js";
import { createTaskTables } from "./schemas/task.schema.js";
import { createOfflineUsersTable } from "./schemas/offline_users.schema.js";
import { createSyncTable } from "./schemas/sync.schema.js";
import { createSettingsTable } from "./schemas/settings.schema.js";

export async function initializeDatabase() {
  await createEmployeeTable();
  await createAttendanceTable();
  await createLeaveTable();
  await createTaskTables();
  await createOfflineUsersTable();
  await createSyncTable();
  await createSettingsTable();
  console.log("Database initialized");
}
