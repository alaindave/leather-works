import { run } from "../db.js";

export async function createOfflineUsersTable() {
  await run(`
  CREATE TABLE IF NOT EXISTS offline_users (
    _id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    lastVerifiedAt TEXT NOT NULL,
    synced INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
  `);

  console.log("OFFLINE USERS TABLE INITIALIZED");
}
