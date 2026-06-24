import { run } from "../db.js";

export async function createLeavesTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS leaves (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      submittedAt TEXT NOT NULL,
      submittedMonth TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      subject TEXT NOT NULL,
      notes TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'En attente d''approbation'
        CHECK(status IN ('Approuvé', 'Refusé', 'En attente d''approbation','Annulé')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (employeeId)
        REFERENCES employees(_id)
    )
  `);

  console.log("LEAVES TABLE INITIALIZED");
}
