import { run } from "../db.js";

export async function createAttendancesTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS attendance_daily_checks (
      _id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'PREPARING'
        CHECK (
          status IN ('PREPARING','OPEN','VERIFIED','MANAGER_NOTIFIED','LOCKED')),
      markAbsentCompleted INTEGER NOT NULL DEFAULT 0,
      markAbsentCompletedAt TEXT,
      markLeaveCompleted INTEGER NOT NULL DEFAULT 0,
      markLeaveCompletedAt TEXT,
      totalEmployees INTEGER NOT NULL DEFAULT 0,
      verifiedEmployees INTEGER NOT NULL DEFAULT 0,
      verifiedAt TEXT,
      verifiedBy TEXT,
      managerId TEXT,
      managerNotifiedAt TEXT,
      managerNotifiedTo TEXT,
      lockedAt TEXT,
      lockedBy TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0,
      lastSyncedAt TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0
);    
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS attendances (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      date TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'MANUAL'
       CHECK(source IN ('MANUAL', 'AUTO_CLIENT','AUTO_SERVER')),
      clockIn TEXT ,
      clockOut TEXT,
      status TEXT NOT NULL
        CHECK(status IN ('PONCTUEL', 'RETARD', 'ABSENT','CONGÉ')),
      lateMinutes INTEGER ,
      notes TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (employeeId)
        REFERENCES employees(_id)
    )
  `);

  await run(`
     CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_employee_date
     ON attendances(employeeId, date)
       WHERE isDeleted = 0;
`);

  await run(`
     CREATE INDEX IF NOT EXISTS idx_attendance_daily_checks_date
        ON attendance_daily_checks(date);
`);

  await run(`
     CREATE INDEX IF NOT EXISTS idx_attendance_daily_checks_status
        ON attendance_daily_checks(status);
    `);

  console.log("ATTENDANCES TABLE INITIALIZED");
}
