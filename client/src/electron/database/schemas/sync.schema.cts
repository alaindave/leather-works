import { run } from "../db.cjs";

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

  console.log("SYNC TABLE INITIALIZED");
}
