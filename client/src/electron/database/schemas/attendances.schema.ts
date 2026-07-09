import { run } from "../db.js";

export async function createAttendancesTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS attendances (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      date TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'MANUAL'
       CHECK(source IN ('MANUAL', 'AUTOMATIC')),
      clockIn TEXT ,
      clockOut TEXT,
      status TEXT NOT NULL
        CHECK(status IN ('PONCTUEL', 'RETARD', 'ABSENT')),
      lateMinutes INTEGER ,
      lateNotes TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (employeeId)
        REFERENCES employees(_id)
    )
  `);

  console.log("ATTENDANCES TABLE INITIALIZED");
}
