import { createEmployeesTable } from "./schemas/employees.schema.js";
import { createTaskRecipientsTable } from "./schemas/task_recipients.schema.js";
import { createAttendancesTable } from "./schemas/attendances.schema.js";
import { createLeavesTable } from "./schemas/leaves.schema.js";
import { createTasksTables } from "./schemas/tasks.schema.js";
import { createOfflineUsersTable } from "./schemas/offline_users.schema.js";
import { createSyncTable } from "./schemas/sync.schema.js";
import { createSettingsTable } from "./schemas/settings.schema.js";

export async function initializeDatabase() {
  await createEmployeesTable();
  await createAttendancesTable();
  await createLeavesTable();
  await createTasksTables();
  await createTaskRecipientsTable();
  await createOfflineUsersTable();
  await createSyncTable();
  await createSettingsTable();
  console.log("Database initialized");
}
