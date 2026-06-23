import { run, get, all } from "../db.js";
import { randomUUID } from "crypto";
import Employee from "../../../shared/types/Employee.js";
import { addToSyncQueue } from "./sync.repository.js";

export async function createEmployee(
  employee: Omit<
    Employee,
    "_id" | "synced" | "isDeleted" | "createdAt" | "updatedAt" | "lastSyncedAt"
  >
) {
  const _id = randomUUID();
  const createdAt = new Date().toISOString();

  await run(
    `
    INSERT INTO employees (
      _id,
      firstName,
      lastName,
      matricule,
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
      employee.matricule,
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

  const savedEmployee = { _id, ...employee, createdAt };

  console.log("Employee to save to sync queue", savedEmployee);

  await addToSyncQueue({
    entity: "employee",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedEmployee),
  });

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
  const existing = await getEmployeeById(_id);

  if (!existing) {
    throw new Error("Employee not found");
  }

  await run(
    `
    UPDATE employees
    SET
      firstName=?,
      lastName=?,
      matricule=?,
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
      data.firstName ?? existing.firstName,
      data.lastName ?? existing.lastName,
      data.matricule ?? existing.matricule,
      data.dateBirth ?? existing.dateBirth,
      data.role ?? existing.role,
      data.dateHired ?? existing.dateHired,
      data.department ?? existing.department,
      data.telephone ?? existing.telephone,
      data.address ?? existing.address,
      data.emergencyContact ?? existing.emergencyContact,
      data.relationship ?? existing.relationship,
      data.contactPhone ?? existing.contactPhone,
      data.salary ?? existing.salary,
      data.status ?? existing.status,
      data.remainingLeave ?? existing.remainingLeave,
      _id,
    ]
  );

  const updatedEmployee = { _id, ...data };
  console.log("Employee to save to sync queue: ", updatedEmployee);

  await addToSyncQueue({
    entity: "employee",
    entityId: _id,
    operation: "update",
    payload: JSON.stringify(updatedEmployee),
  });

  return getEmployeeById(_id);
}

export async function deleteEmployee(_id: string) {
  const deletedAt = new Date().toISOString();

  await run(
    `
    UPDATE employees
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
    `,
    [deletedAt, _id]
  );

  console.log("Employee deletion to save to sync queue", {
    _id,
    deleted: true,
    updatedAt: deletedAt,
  });

  await addToSyncQueue({
    entity: "employee",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({
      _id,
      deleted: true,
      updatedAt: deletedAt,
    }),
  });
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

export async function upsertEmployee(employee: Employee) {
  console.log("BEFORE UPSERT");
  console.log("EMPLOYEE:", employee);
  const local = await getEmployeeById(employee._id);

  if (local && new Date(local.updatedAt!) > new Date(employee.updatedAt!)) {
    return;
  }

  await run(
    `
    INSERT INTO employees (
      _id,
      firstName,
      lastName,
      matricule,
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
      updatedAt,
      lastSyncedAt
    )
    VALUES (
      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
    )

    ON CONFLICT(_id)
    DO UPDATE SET
      firstName = excluded.firstName,
      lastName = excluded.lastName,
      matricule = excluded.matricule,
      dateBirth = excluded.dateBirth,
      role = excluded.role,
      dateHired = excluded.dateHired,
      department = excluded.department,
      telephone = excluded.telephone,
      address = excluded.address,
      emergencyContact = excluded.emergencyContact,
      relationship = excluded.relationship,
      contactPhone = excluded.contactPhone,
      salary = excluded.salary,
      status = excluded.status,
      remainingLeave = excluded.remainingLeave,
      isDeleted = excluded.isDeleted,
      updatedAt = excluded.updatedAt,
      lastSyncedAt = excluded.lastSyncedAt
    `,
    [
      employee._id,
      employee.firstName,
      employee.lastName,
      employee.matricule,
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
      employee.status,
      employee.remainingLeave,
      1,
      employee.isDeleted ? 1 : 0,
      employee.createdAt,
      employee.updatedAt,
      new Date().toISOString(),
    ]
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
