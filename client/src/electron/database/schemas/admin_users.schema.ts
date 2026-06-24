import { run } from "../db.js";

export async function createAdminUsersTable() {
  await run(`
  CREATE TABLE IF NOT EXISTS admin_users (
    _id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    synced INTEGER DEFAULT 0,
    isDeleted INTEGER NOT NULL DEFAULT 0

  );
  `);

  console.log("ADMIN USERS TABLE INITIALIZED");
}
