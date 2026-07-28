import { all, get, run } from "../db.js";
import PayrollEmployeeProfile from "../../../shared/types/payroll/PayrollEmployeeProfile.js";
import { addToSyncQueue } from "./sync.repository.js";
import { randomUUID } from "crypto";
import CreatePayrollProfileDto from "../../../shared/types/payroll/CreatePayrollProfileDto.js";
import { getPayrollComponentById } from "./payroll_components.repository.js";

export async function createEmployeePayrollProfile(
  employeeID: string,
  profile: CreatePayrollProfileDto
) {
  console.log("NEW EMPLOYEE PROFILE:", profile);
  const _id = randomUUID();
  const now = new Date().toISOString();

  await run(
    `
    INSERT INTO employee_payroll_profiles (
      _id,
      employeeId,
      componentId,
      name,
      displayName,
      displayOrder,
      type,
      calculationType,
      value,
      enabled,
      synced,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?, ?,?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      _id,
      employeeID,
      profile.componentId ?? _id,
      profile.name,
      profile.displayName,
      profile.displayOrder,
      profile.type,
      profile.calculationType,
      profile.value,
      1,
      0,
      0,
      now,
      now,
    ]
  );

  const payroll_profile = {
    ...profile,
    _id,
    createdAt: now,
    updatedAt: now,
  };

  console.log("PAYROLL PROFILE TO SAVE TO SYNC QUEUE", payroll_profile);

  await addToSyncQueue({
    entity: "payroll_profile",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(payroll_profile),
  });
}

export async function createManyEmployeePayrollProfiles(
  employeeID: string,
  profiles: CreatePayrollProfileDto[]
) {
  for (const profile of profiles) {
    await createEmployeePayrollProfile(employeeID, profile);
  }
}

export async function updateEmployeePayrollProfile(
  profile: PayrollEmployeeProfile
) {
  if (!profile._id) return;

  const component = await getPayrollComponentById(profile.componentId);
  let isOverridden;

  if (!component) {
    throw new Error(`PAYROLL COMPONENT NOT FOUND FOR PROFILE ${profile._id}`);
  }

  // Determine whether this profile has been customized
  isOverridden =
    profile.displayName !== component.displayName ||
    profile.displayOrder !== component.displayOrder ||
    profile.type !== component.type ||
    profile.calculationType !== component.calculationType ||
    profile.value !== component.defaultValue ||
    profile.enabled !== component.enabled;

  if (isOverridden) {
    profile.isOverridden = 1;
  } else {
    profile.isOverridden = 0;
  }

  console.log("PAYROLL PROFILE TO UPDATE", profile);

  const now = new Date().toISOString();

  await run(
    `
    UPDATE employee_payroll_profiles
    SET
      displayName = ?,
      displayOrder=?,
      type = ?,
      calculationType = ?,
      value = ?,
      enabled = ?,
      synced = ?,
      isOverridden = ?,
      isDeleted = ?,
      updatedAt = ?,
      lastSyncedAt = ?
    WHERE _id = ?
    `,
    [
      profile.displayName,
      profile.displayOrder,
      profile.type,
      profile.calculationType,
      profile.value,
      profile.enabled,
      0,
      profile.isOverridden,
      profile.isDeleted,
      now,
      profile.lastSyncedAt ?? null,
      profile._id,
    ]
  );

  const updatedProfile = await getEmployeePayrollProfile(profile._id);

  console.log("UPDATED PAYROLL PROFILE TO SAVE TO SYNC QUEUE", updatedProfile);

  await addToSyncQueue({
    entity: "payroll_profile",
    entityId: profile._id,
    operation: "update",
    payload: JSON.stringify(updatedProfile),
  });

  return updatedProfile;
}
export async function updateManyEmployeePayrollProfiles(
  profiles: PayrollEmployeeProfile[]
) {
  for (const profile of profiles) {
    await updateEmployeePayrollProfile(profile);
  }
}

export async function upsertEmployeePayrollProfile(
  profile: PayrollEmployeeProfile
) {
  await run(
    `
    INSERT INTO employee_payroll_profiles (
      _id,
      employeeId,
      componentId,
      displayName,
      displayOrder,
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
      displayOrder = excluded.displayOrder,
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
      profile.displayOrder,
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
  profiles: PayrollEmployeeProfile[]
) {
  for (const profile of profiles) {
    await upsertEmployeePayrollProfile(profile);
  }
}

export async function getEmployeePayrollProfile(_id: string) {
  return await get<PayrollEmployeeProfile>(
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
  return await all<PayrollEmployeeProfile>(
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
  return await get<PayrollEmployeeProfile>(
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

export async function getAllEmployeePayrollProfiles(
  employeeID?: string,
  type?: "EARNING" | "DEDUCTION"
): Promise<PayrollEmployeeProfile[]> {
  if (type && employeeID) {
    return await all(
      `
      SELECT *
      FROM employee_payroll_profiles
      WHERE
        employeeId = ?
        AND type = ?
        AND isDeleted = 0
      ORDER BY displayOrder
      `,
      [employeeID, type]
    );
  }

  return await all(
    `
    SELECT *
    FROM employee_payroll_profiles
    ORDER BY displayOrder
    `
  );
}

export async function getUnsyncedEmployeePayrollProfiles() {
  return await all<PayrollEmployeeProfile>(
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
