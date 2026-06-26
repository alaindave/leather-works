import { createEmployeesTable } from "./schemas/employees.schema.js";
import { createAdminUsersTable } from "./schemas/admin_users.schema.js";
import { createAttendancesTable } from "./schemas/attendances.schema.js";
import { createLeavesTable } from "./schemas/leaves.schema.js";
import { createTasksTables } from "./schemas/tasks.schema.js";
import { createOfflineUsersTable } from "./schemas/offline_users.schema.js";
import { createSyncTable } from "./schemas/sync.schema.js";
import { createSettingsTable } from "./schemas/settings.schema.js";

export async function initializeDatabase() {
  await createOfflineUsersTable();
  await createEmployeesTable();
  await createAttendancesTable();
  await createLeavesTable();
  await createTasksTables();
  await createAdminUsersTable();
  await createSyncTable();
  await createSettingsTable();
  console.log("Database initialized");
}
