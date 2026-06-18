import { run } from "./db.cjs";

export async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS employees (
      _id TEXT PRIMARY KEY,

      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      employeeID TEXT NOT NULL UNIQUE,

      dateBirth TEXT NOT NULL,
      role TEXT NOT NULL,
      dateHired TEXT NOT NULL,

      department TEXT NOT NULL,

      telephone TEXT NOT NULL,
      address TEXT NOT NULL,

      emergencyContact TEXT NOT NULL,
      relationship TEXT NOT NULL,
      contactPhone TEXT NOT NULL,

      salary REAL NOT NULL,

      status TEXT NOT NULL DEFAULT 'actif',
      remainingLeave INTEGER NOT NULL DEFAULT 20,

      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,

      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt TEXT
    )
  `);

  console.log("Employees table initialized");
}
