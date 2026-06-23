import { run } from "../db.js";

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
        CHECK(status IN ('Administration', 'Atelier', 'Usine', 'Magasin', 'Sentinelle')),
      telephone TEXT NOT NULL,
      address TEXT NOT NULL,
      emergencyContact TEXT NOT NULL,
      relationship TEXT NOT NULL,
      contactPhone TEXT NOT NULL,
      salary INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'actif',
      remainingLeave INTEGER NOT NULL DEFAULT 20,
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt TEXT
    )
  `);

  console.log("EMPLOYEES TABLE INITIALIZED");
}
