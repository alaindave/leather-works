import { run } from "../db.js";

export async function createAdminUsersMapTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS admin_users_map (
      uuid TEXT PRIMARY KEY NOT NULL,
      mongoId TEXT NOT NULL UNIQUE,
      email TEXT,
      syncedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("ADMIN USERS MAP TABLE INITIALIZED");
}
