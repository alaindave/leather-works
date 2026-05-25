const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../app.db");

const db = new sqlite3.Database(dbPath, (err: any) => {
  if (err) {
    console.error("Database error:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    employeeID TEXT NOT NULL UNIQUE,
    dateBirth TEXT NOT NULL,
    role TEXT NOT NULL,
    dateHired TEXT NOT NULL,
    department TEXT NOT NULL,
    telephone TEXT NOT NULL,
    address TEXT NOT NULL,
    salary TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    remainingLeave INTEGER NOT NULL DEFAULT 20
  )
`);

module.exports = db;
