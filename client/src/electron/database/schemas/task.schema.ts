import { run } from "../db.js";

export async function createTaskTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium'
        CHECK(priority IN ('high', 'medium', 'low')),
      synced INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author) REFERENCES admin_users(_id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS task_recipients (
      taskId INTEGER NOT NULL,
      recipient TEXT NOT NULL,
      PRIMARY KEY (taskId, recipient),
      FOREIGN KEY (taskId) REFERENCES tasks(_id) ON DELETE CASCADE,
      FOREIGN KEY (recipient) REFERENCES admin_users(_id)
    )
  `);

  console.log("TASK TABLES INITIALIZED");
}
