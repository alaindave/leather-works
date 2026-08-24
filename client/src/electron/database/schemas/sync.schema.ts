import { run } from "../db.js";

export async function createSyncTable() {
  await run(`
  CREATE TABLE IF NOT EXISTS sync_queue (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity TEXT NOT NULL,
    entityId TEXT NOT NULL,
    operation TEXT NOT NULL,
    payload TEXT NOT NULL,
    synced INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
  `);

  await run(`
CREATE TABLE IF NOT EXISTS sync_state (
    entity TEXT PRIMARY KEY,
    lastPulledVersion INTEGER NOT NULL DEFAULT 0,
    lastPushedVersion INTEGER NOT NULL DEFAULT 0,
    updatedAt TEXT NOT NULL
);
  `);

  console.log("SYNC TABLE INITIALIZED");
}
