import { run, all } from "../db.js";

export async function createEmployeesTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS employees (
      _id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      matricule TEXT NOT NULL UNIQUE,
      idNum TEXT NOT NULL,
      dateBirth TEXT NOT NULL,
      role TEXT NOT NULL,
      dateHired TEXT NOT NULL,
      department TEXT NOT NULL
        CHECK(department IN (
          'Administration',
          'Atelier',
          'Usine',
          'Magasin',
          'Sentinelle'
        )),
      telephone TEXT NOT NULL,
      address TEXT NOT NULL,
      emergencyContact TEXT NOT NULL,
      relationship TEXT NOT NULL,
      contactPhone TEXT NOT NULL,
      salary INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIF'
        CHECK (status IN ('ACTIF', 'INACTIF')),
      remainingLeave INTEGER NOT NULL DEFAULT 20,
      serverVersion INTEGER NOT NULL DEFAULT 0,
      photo_filename TEXT,
      photo_path TEXT,
      photo_version INTEGER,
      photo_hash TEXT,
      photo_last_modified TEXT,
      photo_needs_upload INTEGER,
      photo_mime_type TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0
    )
  `);

  /*
   * Existing installations need an ALTER TABLE because
   * CREATE TABLE IF NOT EXISTS does not modify existing tables.
   */
  const columns = await all<{ name: string }>(`PRAGMA table_info(employees)`);

  const hasServerVersion = columns.some(
    (column) => column.name === "serverVersion"
  );

  if (!hasServerVersion) {
    console.log("ADDING serverVersion COLUMN TO EMPLOYEES...");

    await run(`
      ALTER TABLE employees
      ADD COLUMN serverVersion INTEGER NOT NULL DEFAULT 0
    `);

    console.log("serverVersion COLUMN ADDED SUCCESSFULLY.");
  }

  console.log("EMPLOYEES TABLE INITIALIZED");
}
