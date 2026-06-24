import { run } from "../db.js";

export async function createAttendancesTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS attendances (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      date TEXT NOT NULL,
      clockIn TEXT NOT NULL,
      clockOut TEXT,
      status TEXT NOT NULL
        CHECK(status IN ('ponctuel', 'retard', 'absent', 'congé')),
      lateMinutes INTEGER NOT NULL DEFAULT 0,
      lateNotes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (employeeId)
        REFERENCES employees(_id)
    )
  `);

  console.log("ATTENDANCES TABLE INITIALIZED");
}
