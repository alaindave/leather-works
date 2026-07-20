import { run } from "../db.js";

export async function createEmployeesDocumentsTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS employees_documents (

    _id TEXT PRIMARY KEY,

    employeeId TEXT NOT NULL,
    uploadedBy TEXT NOT NULL,

    documentType TEXT NOT NULL,
    originalName TEXT NOT NULL,
    fileName TEXT NOT NULL,

    localPath TEXT NOT NULL,

    mimeType TEXT NOT NULL,
    fileSize INTEGER NOT NULL,

    hash TEXT NOT NULL,

    version INTEGER NOT NULL DEFAULT 1,

    needsUpload INTEGER NOT NULL DEFAULT 1,

    isDeleted INTEGER NOT NULL DEFAULT 0,

    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employeeId)
        REFERENCES employees(_id)
        ON DELETE CASCADE,

    FOREIGN KEY (uploadedBy)
        REFERENCES admin_users(_id)
        ON DELETE SET NULL
    )
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_employees_documents_employeeId
    ON employees_documents(employeeId)
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_employees_documents_needs_upload
    ON employees_documents(needsUpload)
  `);

  console.log("EMPLOYEE DOCUMENTS TABLE INITIALIZED");
}
