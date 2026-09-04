import { run } from "../db.js";

export async function createCompanyTable() {
  await run(`
CREATE TABLE IF NOT EXISTS companies (
  companyId TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  signupCode TEXT,
  logoPath TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  serverVersion INTEGER NOT NULL DEFAULT 0,
  lastSyncedAt DATETIME,
  synced INTEGER NOT NULL DEFAULT 0,
  isDeleted INTEGER NOT NULL DEFAULT 0
);
  `);

  console.log("COMPANY TABLE INITIALIZED");
}
