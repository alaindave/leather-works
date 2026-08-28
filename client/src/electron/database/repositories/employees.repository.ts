import { run, get, all } from "../db.js";
import { randomUUID } from "crypto";
import Employee from "../../../common/types/Employee.js";
import { addToSyncQueue } from "./sync.repository.js";
import { initializeEmployeePayrollProfilesForEmployee } from "../../services/payroll/payrollProfile.service.js";

/*
 *
 * ============================================================
 * CREATE EMPLOYEE
 * ============================================================
 *
 */
export async function createEmployee(
  employee: Omit<
    Employee,
    | "_id"
    | "synced"
    | "isDeleted"
    | "createdAt"
    | "updatedAt"
    | "lastSyncedAt"
    | "serverVersion"
  >
) {
  const _id = randomUUID();
  const time = new Date().toISOString();

  const serverVersion = 0;

  await run(
    `
    INSERT INTO employees (
      _id,
      firstName,
      lastName,
      matricule,
      idNum,
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
      createdAt,
      updatedAt,
      serverVersion,
      synced,
      isDeleted
    )
    VALUES (
      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
      ?,?,?,?,0,0
    )
    `,
    [
      _id,
      employee.firstName,
      employee.lastName,
      employee.matricule,
      employee.idNum,
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
      employee.status ?? "ACTIF",
      employee.remainingLeave ?? 20,
      time,
      time,
      serverVersion,
    ]
  );

  await initializeEmployeePayrollProfilesForEmployee(_id);

  const savedEmployee = {
    _id,
    ...employee,
    createdAt: time,
    updatedAt: time,
    serverVersion,
    synced: 0,
    isDeleted: 0,
  };

  console.log("EMPLOYEE TO SAVE TO SYNC QUEUE:", savedEmployee);

  await addToSyncQueue({
    entity: "employee",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedEmployee),
  });

  return getEmployeeById(_id);
}

/**
 * ============================================================
 * GET EMPLOYEE BY ID
 * ============================================================
 */
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

/**
 * ============================================================
 * GET EMPLOYEE BY EMPLOYEE ID / MATRICULE
 * ============================================================
 */
export function getEmployeeByEmployeeID(employeeID: string) {
  return get<Employee>(
    `
    SELECT *
    FROM employees
    WHERE matricule = ?
      AND isDeleted = 0
    `,
    [employeeID]
  );
}

/**
 * ============================================================
 * GET ALL EMPLOYEES
 * ============================================================
 */
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

/**
 * ============================================================
 * SEARCH EMPLOYEES
 * ============================================================
 */
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
        OR matricule LIKE ?
      )
    `,
    [search, search, search]
  );
}

/**
 * ============================================================
 * UPDATE EMPLOYEE
 * ============================================================
 *
 * IMPORTANT:
 *
 * A local edit does NOT increment serverVersion.
 *
 * serverVersion represents the version of the employee on the
 * server. The server assigns a new version when this change
 * is pushed.
 */
export async function updateEmployee(_id: string, data: Partial<Employee>) {
  const existing = await getEmployeeById(_id);

  if (!existing) {
    throw new Error("Employee not found");
  }

  const updatedAt = new Date().toISOString();

  /*
   * Keep the existing serverVersion.
   *
   * The client must never invent a server version.
   */
  const serverVersion = existing.serverVersion ?? 0;

  await run(
    `
    UPDATE employees
    SET
      firstName = ?,
      lastName = ?,
      matricule = ?,
      idNum = ?,
      dateBirth = ?,
      role = ?,
      dateHired = ?,
      department = ?,
      telephone = ?,
      address = ?,
      emergencyContact = ?,
      relationship = ?,
      contactPhone = ?,
      salary = ?,
      status = ?,
      remainingLeave = ?,
      updatedAt = ?,
      serverVersion = ?,
      synced = 0
    WHERE _id = ?
    `,
    [
      data.firstName ?? existing.firstName,
      data.lastName ?? existing.lastName,
      data.matricule ?? existing.matricule,
      data.idNum ?? existing.idNum,
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
      updatedAt,
      serverVersion,
      _id,
    ]
  );

  /*
   * Read the complete updated employee from SQLite.
   *
   * This is better than constructing { _id, ...data } because
   * the latter can omit fields that weren't part of the update.
   */
  const updatedEmployee = await getEmployeeByIdIncludingDeleted(_id);

  if (!updatedEmployee) {
    throw new Error("Failed to retrieve updated employee");
  }

  console.log("EMPLOYEE TO SAVE TO SYNC QUEUE:", updatedEmployee);

  await addToSyncQueue({
    entity: "employee",
    entityId: _id,
    operation: "update",
    payload: JSON.stringify(updatedEmployee),
  });

  return updatedEmployee;
}

/**
 * ============================================================
 * DELETE EMPLOYEE
 * ============================================================
 *
 * Soft delete.
 *
 * serverVersion remains unchanged locally.
 * The server will assign a new version when the delete reaches
 * the backend.
 */
export async function deleteEmployee(_id: string) {
  const existing = await getEmployeeByIdIncludingDeleted(_id);

  if (!existing) {
    throw new Error("Employee not found");
  }

  const updatedAt = new Date().toISOString();

  await run(
    `
    UPDATE employees
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?,
      serverVersion = ?
    WHERE _id = ?
    `,
    [updatedAt, existing.serverVersion ?? 0, _id]
  );

  /*
   * Find payroll profiles belonging to this employee.
   */
  const payrollProfiles = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_employee_profiles
    WHERE employeeId = ?
      AND isDeleted = 0
    `,
    [_id]
  );

  /*
   * Soft-delete payroll profiles.
   */
  for (const profile of payrollProfiles) {
    await run(
      `
      UPDATE payroll_employee_profiles
      SET
        isDeleted = 1,
        enabled = 0,
        synced = 0,
        updatedAt = ?
      WHERE _id = ?
      `,
      [updatedAt, profile._id]
    );

    await addToSyncQueue({
      entity: "payroll_profile",
      entityId: profile._id,
      operation: "delete",
      payload: JSON.stringify({
        _id: profile._id,
        employeeId: _id,
        updatedAt,
      }),
    });
  }

  /*
   * Queue the complete employee deletion payload.
   */
  const deletedEmployee = await getEmployeeByIdIncludingDeleted(_id);

  await addToSyncQueue({
    entity: "employee",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify(deletedEmployee),
  });

  console.log("EMPLOYEE AND PAYROLL PROFILE DELETION QUEUED", {
    employeeId: _id,
    payrollProfilesDeleted: payrollProfiles.length,
    updatedAt,
    serverVersion: existing.serverVersion ?? 0,
  });
}

/**
 * ============================================================
 * GET UNSYNCED EMPLOYEES
 * ============================================================
 */
export function getUnsyncedEmployees() {
  return all<Employee>(
    `
    SELECT *
    FROM employees
    WHERE synced = 0
    ORDER BY serverVersion ASC
    `
  );
}

/*
 * ============================================================
 * UPSERT EMPLOYEE FROM SERVER
 * ============================================================
 *
 */
export async function upsertEmployee(employee: Employee) {
  const local = await getEmployeeByIdIncludingDeleted(employee._id);
  const incomingVersion = Number(employee.serverVersion ?? 0);
  const localVersion = Number(local?.serverVersion ?? 0);

  /*
   * ==========================================================
   * CASE 1: Local employee does not exist
   * ==========================================================
   */
  if (!local) {
    await run(
      `
      INSERT INTO employees (
        _id,
        firstName,
        lastName,
        matricule,
        idNum,
        dateBirth,
        dateHired,
        role,
        department,
        salary,
        remainingLeave,
        status,
        telephone,
        address,
        emergencyContact,
        relationship,
        contactPhone,
        createdAt,
        updatedAt,
        serverVersion,
        isDeleted,
        synced,
        lastSyncedAt
      )
      VALUES (
      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,CURRENT_TIMESTAMP
      )
      `,
      [
        employee._id,
        employee.firstName,
        employee.lastName,
        employee.matricule,
        employee.idNum,
        employee.dateBirth,
        employee.dateHired,
        employee.role,
        employee.department,
        employee.salary,
        employee.remainingLeave,
        employee.status,
        employee.telephone,
        employee.address,
        employee.emergencyContact,
        employee.relationship,
        employee.contactPhone,
        employee.createdAt,
        employee.updatedAt,
        incomingVersion,
        employee.isDeleted ?? 0,
      ]
    );

    console.log(
      `INSERTED EMPLOYEE FROM SERVER: ${employee._id} (v${incomingVersion})`
    );

    return;
  }

  /*
   * ==========================================================
   * CASE 2: Local employee has unsynced changes
   * ==========================================================
   * The push operation needs to reach the server first.
   */
  if (local.synced === 0) {
    console.warn(
      `SKIPPING SERVER EMPLOYEE ${employee._id}: LOCAL CHANGES ARE UNSYNCED`,
      {
        localVersion,
        incomingVersion,
      }
    );

    return;
  }

  /*
   * ==========================================================
   * CASE 3: Incoming version is older
   * ==========================================================
   */
  if (incomingVersion <= localVersion) {
    console.log(
      `SKIPPING EMPLOYEE ${employee._id}: LOCAL VERSION IS NEWER/EQUAL`,
      {
        localVersion,
        incomingVersion,
      }
    );

    return;
  }

  /*
   * ==========================================================
   * CASE 4: Server has a newer version
   * ==========================================================
   */
  await run(
    `
    UPDATE employees
    SET
      firstName = ?,
      lastName = ?,
      matricule = ?,
      idNum = ?,
      dateBirth = ?,
      dateHired = ?,
      role = ?,
      department = ?,
      salary = ?,
      remainingLeave = ?,
      status = ?,
      telephone = ?,
      address = ?,
      emergencyContact = ?,
      relationship = ?,
      contactPhone = ?,
      createdAt = ?,
      updatedAt = ?,
      serverVersion = ?,
      isDeleted = ?,
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [
      employee.firstName,
      employee.lastName,
      employee.matricule,
      employee.idNum,
      employee.dateBirth,
      employee.dateHired,
      employee.role,
      employee.department,
      employee.salary,
      employee.remainingLeave,
      employee.status,
      employee.telephone,
      employee.address,
      employee.emergencyContact,
      employee.relationship,
      employee.contactPhone,
      employee.createdAt,
      employee.updatedAt,
      incomingVersion,
      employee.isDeleted ?? 0,
      employee._id,
    ]
  );

  console.log(
    `UPDATED EMPLOYEE FROM SERVER: ${employee._id} ` +
      `(v${localVersion} → v${incomingVersion})`
  );
}

/**
 * ============================================================
 * MARK EMPLOYEE AS SYNCED
 * ============================================================
 *
 * Does NOT modify serverVersion.
 */
export async function markEmployeeSynced(_id: string) {
  await run(
    `
    UPDATE employees
    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );
}

/**
 * ============================================================
 * INTERNAL HELPER
 * ============================================================
 *
 * Unlike getEmployeeById(), this also returns soft-deleted
 * employees.
 *
 * This is necessary when processing server-side deletes.
 */
async function getEmployeeByIdIncludingDeleted(_id: string) {
  return get<Employee>(
    `
    SELECT *
    FROM employees
    WHERE _id = ?
    `,
    [_id]
  );
}
