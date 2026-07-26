import { all, get, run } from "../db.js";
import EmployeePayrollProfile from "../../../shared/types/payroll/PayrollEmployeeProfile.js";
import { addToSyncQueue } from "./sync.repository.js";

export async function createEmployeePayrollProfile(
  profile: EmployeePayrollProfile
) {
  const now = new Date().toISOString();
  await run(
    `
    INSERT INTO employee_payroll_profiles (
      _id,
      employeeId,
      componentId,
      displayName,
      type,
      calculationType,
      value,
      enabled,
      synced,
      isDeleted,
      createdAt,
      updatedAt,
      lastSyncedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      profile._id,
      profile.employeeId,
      profile.componentId,
      profile.displayName,
      profile.type,
      profile.calculationType,
      profile.value,
      profile.enabled,
      profile.synced,
      profile.isDeleted,
      profile.createdAt,
      profile.updatedAt,
      profile.lastSyncedAt ?? null,
    ]
  );

  const payroll_profile = {
    ...profile,
    _id: profile._id,
    createdAt: now,
    updatedAt: now,
  };

  console.log("PAYROLL PROFILE TO SAVE TO SYNC QUEUE", payroll_profile);

  await addToSyncQueue({
    entity: "payroll_profile",
    entityId: profile._id,
    operation: "create",
    payload: JSON.stringify(payroll_profile),
  });
}

export async function createManyEmployeePayrollProfiles(
  profiles: EmployeePayrollProfile[]
) {
  for (const profile of profiles) {
    await createEmployeePayrollProfile(profile);
  }
}

export async function updateEmployeePayrollProfile(
  profile: EmployeePayrollProfile
) {
  const now = new Date().toISOString();
  await run(
    `
    UPDATE employee_payroll_profiles
    SET
      displayName = ?,
      type = ?,
      calculationType = ?,
      value = ?,
      enabled = ?,
      synced = ?,
      isDeleted = ?,
      updatedAt = ?,
      lastSyncedAt = ?
    WHERE _id = ?
    `,
    [
      profile.displayName,
      profile.type,
      profile.calculationType,
      profile.value,
      profile.enabled,
      profile.synced,
      profile.isDeleted,
      profile.updatedAt,
      profile.lastSyncedAt ?? null,
      profile._id,
    ]
  );
  const payroll_profile = {
    ...profile,
    _id: profile._id,
    updatedAt: now,
  };

  console.log(
    "UPDATED PAYROLL PROFILE  TO SAVE TO SYNC QUEUE",
    payroll_profile
  );

  await addToSyncQueue({
    entity: "payroll_profile",
    entityId: profile._id,
    operation: "update",
    payload: JSON.stringify(payroll_profile),
  });
}

export async function updateManyEmployeePayrollProfiles(
  profiles: EmployeePayrollProfile[]
) {
  for (const profile of profiles) {
    await updateEmployeePayrollProfile(profile);
  }
}

export async function upsertEmployeePayrollProfile(
  profile: EmployeePayrollProfile
) {
  await run(
    `
    INSERT INTO employee_payroll_profiles (
      _id,
      employeeId,
      componentId,
      displayName,
      type,
      calculationType,
      value,
      enabled,
      synced,
      isDeleted,
      createdAt,
      updatedAt,
      lastSyncedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(_id)
    DO UPDATE SET
      employeeId = excluded.employeeId,
      componentId = excluded.componentId,
      displayName = excluded.displayName,
      type = excluded.type,
      calculationType = excluded.calculationType,
      value = excluded.value,
      enabled = excluded.enabled,
      synced = excluded.synced,
      isDeleted = excluded.isDeleted,
      updatedAt = excluded.updatedAt,
      lastSyncedAt = excluded.lastSyncedAt
    `,
    [
      profile._id,
      profile.employeeId,
      profile.componentId,
      profile.displayName,
      profile.type,
      profile.calculationType,
      profile.value,
      profile.enabled,
      profile.synced,
      profile.isDeleted,
      profile.createdAt,
      profile.updatedAt,
      profile.lastSyncedAt ?? null,
    ]
  );
}

export async function upsertManyEmployeePayrollProfiles(
  profiles: EmployeePayrollProfile[]
) {
  for (const profile of profiles) {
    await upsertEmployeePayrollProfile(profile);
  }
}

export async function getEmployeePayrollProfile(_id: string) {
  return await get<EmployeePayrollProfile>(
    `
    SELECT *
    FROM employee_payroll_profiles
    WHERE _id = ?
      AND isDeleted = 0
    `,
    [_id]
  );
}

export async function getEmployeePayrollProfilesByEmployee(employeeId: string) {
  return await all<EmployeePayrollProfile>(
    `
    SELECT *
    FROM employee_payroll_profiles
    WHERE employeeId = ?
      AND isDeleted = 0
    ORDER BY displayName
    `,
    [employeeId]
  );
}

export async function getEmployeePayrollProfileByComponent(
  employeeId: string,
  componentId: string
) {
  return await get<EmployeePayrollProfile>(
    `
    SELECT *
    FROM employee_payroll_profiles
    WHERE employeeId = ?
      AND componentId = ?
      AND isDeleted = 0
    `,
    [employeeId, componentId]
  );
}

export async function getAllEmployeePayrollProfiles() {
  return await all<EmployeePayrollProfile>(
    `
    SELECT *
    FROM employee_payroll_profiles
    WHERE isDeleted = 0
    ORDER BY employeeId, displayName
    `
  );
}

export async function getUnsyncedEmployeePayrollProfiles() {
  return await all<EmployeePayrollProfile>(
    `
    SELECT *
    FROM employee_payroll_profiles
    WHERE synced = 0
    `
  );
}

export async function markEmployeePayrollProfileSynced(_id: string) {
  await run(
    `
    UPDATE employee_payroll_profiles
    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );
}

export async function markManyEmployeePayrollProfilesSynced(ids: string[]) {
  for (const id of ids) {
    await markEmployeePayrollProfileSynced(id);
  }
}

export async function deleteEmployeePayrollProfile(_id: string) {
  const now = new Date().toISOString();
  await run(
    `
    UPDATE employee_payroll_profiles
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );

  const payroll_profile = {
    _id,
    updatedAt: now,
  };

  console.log("DELETED PAYROLL PROFILE TO SAVE TO SYNC QUEUE", payroll_profile);

  await addToSyncQueue({
    entity: "payroll_profile",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify(payroll_profile),
  });
}

export async function restoreEmployeePayrollProfile(_id: string) {
  await run(
    `
    UPDATE employee_payroll_profiles
    SET
      isDeleted = 0,
      synced = 0,
      updatedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );
}

export async function permanentlyDeleteEmployeePayrollProfile(_id: string) {
  await run(
    `
    DELETE FROM employee_payroll_profiles
    WHERE _id = ?
    `,
    [_id]
  );
}

export async function employeePayrollProfileExists(
  employeeId: string,
  componentId: string
): Promise<boolean> {
  const profile = await getEmployeePayrollProfileByComponent(
    employeeId,
    componentId
  );

  return !!profile;
}

export async function countEmployeePayrollProfiles(): Promise<number> {
  const result = await get<{ count: number }>(
    `
    SELECT COUNT(*) AS count
    FROM employee_payroll_profiles
    WHERE isDeleted = 0
    `
  );

  return result?.count ?? 0;
}
