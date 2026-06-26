import { run } from "../db.js";

export async function createTasksTables() {
  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
      _id TEXT PRIMARY KEY,
      taskNumber TEXT NOT NULL,
      author TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'Moyenne'
        CHECK(priority IN ('Haute', 'Moyenne', 'Basse')),
      deadline TEXT NOT NULL,
      isResolved INTEGER DEFAULT 0,
      resolutionNotes TEXT,
      submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolvedAt DATETIME,
      resolvedBy TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (author) REFERENCES admin_users(_id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS task_recipients (
      taskId TEXT NOT NULL,
      recipient TEXT NOT NULL,
      PRIMARY KEY (taskId, recipient),
      FOREIGN KEY (taskId) REFERENCES tasks(_id) ON DELETE CASCADE,
      FOREIGN KEY (recipient) REFERENCES admin_users(_id)
    )
  `);

  await run(`
  CREATE TABLE IF NOT EXISTS task_comments (
    _id TEXT PRIMARY KEY,
    taskId TEXT NOT NULL,
    author TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastSyncedAt DATETIME,
    synced INTEGER DEFAULT 0,
    isDeleted INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (taskId)
      REFERENCES tasks(_id)
      ON DELETE CASCADE,
    FOREIGN KEY (author)
      REFERENCES admin_users(_id)
  )
`);

  console.log("TASKS TABLES INITIALIZED");
}
