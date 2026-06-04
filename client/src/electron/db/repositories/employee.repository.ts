import { run, get, all } from "../db";
import { randomUUID } from "crypto";
import Employee from "@shared/types/Employee";

export async function createEmployee(data: Omit<Employee, "_id" | "synced">) {
  const _id = randomUUID();

  await run(
    `INSERT INTO employees (
        id, firstName, lastName, employeeID,
        dateBirth, role, dateHired,
        department, telephone, address,
        emergencyContact, relationship, contactPhone,
        salary, status, remainingLeave, synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      _id,
      data.firstName,
      data.lastName,
      data.employeeID,
      data.dateBirth,
      data.role,
      data.dateHired,
      data.department,
      data.telephone,
      data.address,
      data.emergencyContact,
      data.relationship,
      data.contactPhone,
      data.salary,
      data.status ?? "actif",
      data.remainingLeave ?? 20,
    ]
  );

  return getEmployeeById(_id);
}

export function getEmployeeById(_id: string) {
  return get<Employee>("SELECT * FROM employees WHERE id = ?", [_id]);
}

export function getAllEmployees() {
  return all<Employee>("SELECT * FROM employees ORDER BY createdAt DESC");
}

export async function updateEmployee(_id: string, data: Partial<Employee>) {
  await run(
    `UPDATE employees SET
        firstName = ?,
        lastName = ?,
        role = ?,
        department = ?,
        telephone = ?,
        address = ?,
        emergencyContact = ?,
        relationship = ?,
        contactPhone = ?,
        salary = ?,
        status = ?,
        remainingLeave = ?,
        synced = 0,
        updatedAt = datetime('now')
      WHERE id = ?`,
    [
      data.firstName,
      data.lastName,
      data.role,
      data.department,
      data.telephone,
      data.address,
      data.emergencyContact,
      data.relationship,
      data.contactPhone,
      data.salary,
      data.status,
      data.remainingLeave,
      _id,
    ]
  );

  return getEmployeeById(_id);
}

export async function deleteEmployee(_id: string) {
  await run("DELETE FROM employees WHERE id = ?", [_id]);
}

export function getUnsyncedEmployees() {
  return all<Employee>("SELECT * FROM employees WHERE synced = 0");
}

export async function markEmployeeSynced(_id: string) {
  await run(
    "UPDATE employees SET synced = 1, updatedAt = datetime('now') WHERE id = ?",
    [_id]
  );
}
