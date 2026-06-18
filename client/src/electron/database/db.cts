import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";

const dbPath = path.join(app.getPath("userData"), "hr.sqlite");
console.log("Database path: ", dbPath);

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("DB error:", err);
  else console.log("SQLite connected");
});

export const run = (sql: string, params: any[] = []) =>
  new Promise<void>((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
// prettier-ignore
export const get = <T,>(sql: string, params: any[] = []) =>
  new Promise<T | null>((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
// prettier-ignore
export const all = <T,>(sql: string, params: any[] = []) =>
  new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
