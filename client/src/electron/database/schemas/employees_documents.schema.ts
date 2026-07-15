import { run } from "../db.js";

export async function createEmployeesDocumentsTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS employees_documents (
      _id TEXT PRIMARY KEY,

    employeeId TEXT NOT NULL,
    uploadedBy TEXT,

    document_type TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_name TEXT NOT NULL,

    local_path TEXT NOT NULL,

    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,

    hash TEXT NOT NULL,

    version INTEGER NOT NULL DEFAULT 1,

    uploaded INTEGER NOT NULL DEFAULT 0,
    needs_upload INTEGER NOT NULL DEFAULT 1,

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
    ON employees_documents(needs_upload)
  `);

  console.log("EMPLOYEE DOCUMENTS TABLE INITIALIZED");
}
