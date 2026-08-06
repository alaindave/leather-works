import { run } from "../db.js";

export async function createPayrollTables() {
  //Creating tables
  await run(`
    CREATE TABLE IF NOT EXISTS payroll_components (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      displayName TEXT NOT NULL,
      type TEXT NOT NULL
        CHECK(type IN ('EARNING','DEDUCTION')),
      calculationType TEXT NOT NULL
        CHECK(calculationType IN ('FIXE','POURCENTAGE','MANUEL'))
        DEFAULT 'MANUEL',
      percentageOf TEXT
        CHECK(percentageOf IN ('BASIC_SALARY', 'GROSS_SALARY', 'TOTAL_EARNINGS', 'TAXABLE_AMOUNT')),
      defaultValue REAL DEFAULT 0,
      displayOrder INTEGER NOT NULL,
      isSystem INTEGER NOT NULL DEFAULT 1,
      requiresHRApproval INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payroll_employee_profiles (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      componentId TEXT,
      name TEXT NOT NULL,
      displayName TEXT NOT NULL,
      displayOrder INTEGER NOT NULL,
      type TEXT NOT NULL,
      calculationType TEXT NOT NULL
        CHECK(calculationType IN ('FIXE','POURCENTAGE','MANUEL'))
        DEFAULT 'MANUEL',
      value REAL,
      isOverridden INTEGER DEFAULT 0,
      requiresHRApproval INTEGER NOT NULL DEFAULT 0,
      percentageOf TEXT
        CHECK(percentageOf IN ('BASIC_SALARY', 'GROSS_SALARY', 'TOTAL_EARNINGS', 'TAXABLE_AMOUNT')),
      enabled INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT,
      lastSyncedAt Text,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER DEFAULT 0,

      FOREIGN KEY(employeeId)
        REFERENCES employees(_id)
        ON DELETE CASCADE,

      FOREIGN KEY(componentId)
        REFERENCES payroll_components(_id)
        ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payroll_runs (
      _id TEXT PRIMARY KEY,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      employeeCount INTEGER NOT NULL DEFAULT 0,
      totalBasicSalary REAL NOT NULL DEFAULT 0,
      totalEarnings REAL NOT NULL DEFAULT 0,
      totalDeductions REAL NOT NULL DEFAULT 0,
      totalNetSalary REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL
        CHECK(status IN ('BROUILLON','VERIFICATION','APPROUVÉ','PAYÉ','ANNULÉ'))
        DEFAULT 'BROUILLON',
      generatedBy TEXT NOT NULL,
      submittedForVerificationAt TEXT,
      submittedForVerificationBy TEXT,
      approvedAt TEXT,
      approvedBy TEXT,
      paidAt TEXT,
      paidBy TEXT,
      cancelledAt TEXT,
      cancelledBy TEXT,
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      deletedBy TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (generatedBy) REFERENCES admin_users(_id)
        ON DELETE RESTRICT,
      FOREIGN KEY(submittedForVerificationBy) REFERENCES admin_users(_id)
        ON DELETE RESTRICT,
      FOREIGN KEY(approvedBy) REFERENCES admin_users(_id)
        ON DELETE RESTRICT,
      FOREIGN KEY(paidBy) REFERENCES admin_users(_id)
        ON DELETE RESTRICT,
      FOREIGN KEY(cancelledBy) REFERENCES admin_users(_id)
        ON DELETE RESTRICT,
      FOREIGN KEY(deletedBy) REFERENCES admin_users(_id)
        ON DELETE RESTRICT

    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payroll_results (
      _id TEXT PRIMARY KEY,
      payrollRunId TEXT NOT NULL,
      employeeId TEXT NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      baseSalary REAL NOT NULL DEFAULT 0,
      grossSalary REAL NOT NULL DEFAULT 0,
      totalEarnings REAL NOT NULL DEFAULT 0,
      totalDeductions REAL NOT NULL DEFAULT 0,
      netSalary REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL
        CHECK(status IN ('BROUILLON','VERIFICATION','APPROUVÉ','PAYÉ','ANNULÉ'))
        DEFAULT 'BROUILLON',
      cancelledAt TEXT,
      verifiedAt TEXT,
      approvedAt TEXT,
      paidAt TEXT,
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY(payrollRunId)
        REFERENCES payroll_runs(_id)
        ON DELETE CASCADE,

      FOREIGN KEY(employeeId)
        REFERENCES employees(_id)
   );
`);

  await run(`
    CREATE TABLE IF NOT EXISTS payroll_items (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      payrollResultId TEXT NOT NULL,
      componentId TEXT NOT NULL,
      name TEXT NOT NULL,
      displayName TEXT NOT NULL,
      type TEXT NOT NULL
        CHECK(type IN ('EARNING','DEDUCTION')),
      amount REAL NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (employeeId)
         REFERENCES employees(_id),
      FOREIGN KEY (payrollResultId)
         REFERENCES payroll_results(_id)
         ON DELETE CASCADE,
      FOREIGN KEY(componentId)
        REFERENCES payroll_components(_id)
    );
  `);

  // Creating Index
  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_components_type
      ON payroll_components(type);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_components_synced
      ON payroll_components(synced);
  `);

  await run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_payroll_period
  ON payroll_runs(month, year)
  WHERE status <> 'ANNULÉ';
 `);

  await run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_payroll_result_employee_period
  ON payroll_results(employeeId, month, year)
  WHERE status <> 'ANNULÉ';
`);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_synced
      ON payroll_runs(synced);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_items_payroll
      ON payroll_items(payrollResultId);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_items_component
      ON payroll_items(componentId);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_items_type
      ON payroll_items(type);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_items_synced
      ON payroll_items(synced);
  `);

  console.log("PAYROLL TABLES INITIALIZED");
}
