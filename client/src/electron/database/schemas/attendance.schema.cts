import { run } from "../db.cjs";

export async function createAttendanceTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS attendance (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      date TEXT NOT NULL,
      clockIn TEXT NOT NULL,
      clockOut TEXT,
      status TEXT NOT NULL
        CHECK(status IN ('ponctuel', 'retard', 'absent', 'congé')),
      lateMinutes INTEGER NOT NULL DEFAULT 0,
      lateNotes TEXT,
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (employeeId)
        REFERENCES employees(_id),
      UNIQUE(employeeId, date)
    )
  `);

  console.log("Attendance table initialized");
}
