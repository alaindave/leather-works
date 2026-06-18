import { run, get, all } from "../db.cjs";
import { randomUUID } from "crypto";
import Employee from "@shared/types/Employee";

export async function createEmployee(
  employee: Omit<
    Employee,
    "_id" | "synced" | "isDeleted" | "createdAt" | "updatedAt" | "lastSyncedAt"
  >
) {
  const _id = randomUUID();

  await run(
    `
    INSERT INTO employees (
      _id,
      firstName,
      lastName,
      employeeID,
      dateBirth,
      role,
      dateHired,
      department,
      telephone,
      address,
      emergencyContact,
      relationship,
      contactPhone,
      salary,
      status,
      remainingLeave,
      synced,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (
      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
      0,
      0,
      datetime('now'),
      datetime('now')
    )
    `,
    [
      _id,
      employee.firstName,
      employee.lastName,
      employee.employeeID,
      employee.dateBirth,
      employee.role,
      employee.dateHired,
      employee.department,
      employee.telephone,
      employee.address,
      employee.emergencyContact,
      employee.relationship,
      employee.contactPhone,
      employee.salary,
      employee.status ?? "actif",
      employee.remainingLeave ?? 20,
    ]
  );

  return getEmployeeById(_id);
}

export function getEmployeeById(_id: string) {
  return get<Employee>(
    `
    SELECT *
    FROM employees
    WHERE _id = ?
      AND isDeleted = 0
    `,
    [_id]
  );
}

export function getEmployeeByEmployeeID(employeeID: string) {
  return get<Employee>(
    `
    SELECT *
    FROM employees
    WHERE employeeID = ?
      AND isDeleted = 0
    `,
    [employeeID]
  );
}

export function getAllEmployees() {
  return all<Employee>(
    `
    SELECT *
    FROM employees
    WHERE isDeleted = 0
    ORDER BY lastName ASC
    `
  );
}

export function searchEmployees(searchTerm: string) {
  const search = `%${searchTerm}%`;

  return all<Employee>(
    `
    SELECT *
    FROM employees
    WHERE isDeleted = 0
      AND (
        firstName LIKE ?
        OR lastName LIKE ?
        OR employeeID LIKE ?
      )
    `,
    [search, search, search]
  );
}

export async function updateEmployee(_id: string, data: Partial<Employee>) {
  await run(
    `
    UPDATE employees
    SET
      firstName=?,
      lastName=?,
      employeeID=?,
      dateBirth=?,
      role=?,
      dateHired=?,
      department=?,
      telephone=?,
      address=?,
      emergencyContact=?,
      relationship=?,
      contactPhone=?,
      salary=?,
      status=?,
      remainingLeave=?,
      synced=0,
      updatedAt=datetime('now')
    WHERE _id=?
    `,
    [
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
      data.status,
      data.remainingLeave,
      _id,
    ]
  );

  return getEmployeeById(_id);
}

export async function deleteEmployee(_id: string) {
  await run(
    `
    UPDATE employees
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = datetime('now')
    WHERE _id = ?
    `,
    [_id]
  );
}

export function getUnsyncedEmployees() {
  return all<Employee>(
    `
    SELECT *
    FROM employees
    WHERE synced = 0
    `
  );
}

export async function markEmployeeSynced(_id: string) {
  await run(
    `
    UPDATE employees
    SET
      synced = 1,
      lastSyncedAt = datetime('now')
    WHERE _id = ?
    `,
    [_id]
  );
}
