import { run } from "../db.js";

export async function createLeaveTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS leave (
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
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (employeeId)
        REFERENCES employees(_id)
    )
  `);

  console.log("LEAVE TABLE INITIALIZED");
}
