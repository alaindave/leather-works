import { run } from "../db.js";

export async function createPayrollTables() {
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
      percentageOf TEXT,
      defaultValue REAL NOT NULL DEFAULT 0,
      displayOrder INTEGER NOT NULL DEFAULT 1,
      isSystem INTEGER NOT NULL DEFAULT 1,
      enabled INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_components_type
    ON payroll_components(type);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_components_synced
    ON payroll_components(synced);
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payrolls (
      _id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      generatedBy TEXT,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      grossSalary REAL NOT NULL DEFAULT 0,
      totalDeductions REAL NOT NULL DEFAULT 0,
      netSalary REAL NOT NULL DEFAULT 0,
      notes TEXT,
      status TEXT NOT NULL
        CHECK(status IN ('BROUILLON','APPROUVÉ','PAYÉ'))
        DEFAULT 'BROUILLON',
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(employeeId) REFERENCES employees(_id),
      FOREIGN KEY(generatedBy) REFERENCES admin_users(_id)
    );
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_employee
    ON payrolls(employeeId);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_period
    ON payrolls(month, year);
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_synced
    ON payrolls(synced);
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payroll_items (
      _id TEXT PRIMARY KEY,
      payrollId TEXT NOT NULL,
      componentId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL
        CHECK(type IN ('EARNING','DEDUCTION')),
      amount REAL NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastSyncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(payrollId)
        REFERENCES payrolls(_id)
        ON DELETE CASCADE,
      FOREIGN KEY(componentId)
        REFERENCES payroll_components(_id)
    );
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_payroll_items_payroll
    ON payroll_items(payrollId);
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
