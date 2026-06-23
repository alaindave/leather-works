import { run } from "../db.js";

export async function createTaskRecipientsTable() {
  await run(`
  CREATE TABLE IF NOT EXISTS task_recipients (
    _id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    lastSyncedAt TEXT NOT NULL,
    isDeleted INTEGER NOT NULL DEFAULT 0

  );
  `);

  console.log("TASK RECIPIENTS TABLE INITIALIZED");
}
