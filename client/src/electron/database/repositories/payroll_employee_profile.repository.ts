import { all, get, run } from "../db.js";
import PayrollEmployeeProfile from "../../../common/types/payroll/PayrollEmployeeProfile.js";
import { addToSyncQueue } from "./sync.repository.js";
import { randomUUID } from "crypto";
import CreatePayrollProfileDto from "../../../common/types/payroll/CreatePayrollProfileDto.js";
import { getPayrollComponentById } from "./payroll_components.repository.js";
import { PayrollEmployeeInput } from "../../../common/types/payroll/Payroll.js";

export async function createEmployeePayrollProfile(
  employeeId: string,
  profile: CreatePayrollProfileDto
) {
  console.log("NEW EMPLOYEE PROFILE:", profile);

  const _id = randomUUID();
  const now = new Date().toISOString();

  // Local records have not received a server version yet.
  const serverVersion = 0;

  await run(
    `
    INSERT INTO payroll_employee_profiles (
      _id,
      employeeId,
      componentId,
      name,
      displayName,
      displayOrder,
      type,
      calculationType,
      value,
      taxable,
      requiresHRApproval,
      enabled,
      synced,
      isDeleted,
      serverVersion,
      createdAt,
      updatedAt
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      _id,
      employeeId,
      profile.componentId ?? _id,
      profile.name,
      profile.displayName,
      profile.displayOrder,
      profile.type,
      profile.calculationType,
      profile.value,
      profile.taxable,
      profile.requiresHRApproval ?? 0,
      1,
      0,
      0,
      serverVersion,
      now,
      now,
    ]
  );

  const payroll_profile = {
    ...profile,
    employeeId,
    _id,
    serverVersion,
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

  return payroll_profile;
}

export async function createManyEmployeePayrollProfiles(
  employeeId: string,
  profiles: CreatePayrollProfileDto[]
) {
  for (const profile of profiles) {
    await createEmployeePayrollProfile(employeeId, profile);
  }
}

export async function updateEmployeePayrollProfile(
  profile: PayrollEmployeeProfile
) {
  if (!profile._id) return;

  let isOverridden;

  const component = await getPayrollComponentById(profile.componentId);

  /*
   * CUSTOM PROFILE / COMPONENT NO LONGER EXISTS
   */
  if (!component) {
    console.log(`PAYROLL COMPONENT NOT FOUND FOR PROFILE ${profile._id}`);

    const existingProfile = await getEmployeePayrollProfile(profile._id);

    if (existingProfile) {
      console.log("PAYROLL PROFILE TO UPDATE", profile);

      const now = new Date().toISOString();

      await run(
        `
        UPDATE payroll_employee_profiles
        SET
          displayName = ?,
          displayOrder = ?,
          type = ?,
          calculationType = ?,
          calculationBase = ?,
          value = ?,
          taxable = ?,
          requiresHRApproval = ?,
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
          profile.calculationBase,
          profile.value,
          profile.taxable,
          profile.requiresHRApproval,
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

      console.log(
        "UPDATED PAYROLL PROFILE TO SAVE TO SYNC QUEUE",
        updatedProfile
      );

      await addToSyncQueue({
        entity: "payroll_profile",
        entityId: profile._id,
        operation: "update",
        payload: JSON.stringify(updatedProfile),
      });

      return updatedProfile;
    }

    throw new Error("NO DEFAULT OR CUSTOM COMPONENTS FOUND WITH THAT ID");
  }

  /*
   * Determine whether this profile has been customized.
   */
  isOverridden =
    profile.displayName !== component.displayName ||
    profile.displayOrder !== component.displayOrder ||
    profile.type !== component.type ||
    profile.calculationType !== component.calculationType ||
    profile.calculationBase !== component.calculationBase ||
    profile.value !== component.defaultValue ||
    profile.enabled !== component.enabled ||
    profile.requiresHRApproval !== component.requiresHRApproval;

  profile.isOverridden = isOverridden ? 1 : 0;

  console.log("PAYROLL PROFILE TO UPDATE", profile);

  const now = new Date().toISOString();

  await run(
    `
    UPDATE payroll_employee_profiles
    SET
      displayName = ?,
      displayOrder = ?,
      type = ?,
      calculationType = ?,
      calculationBase = ?,
      value = ?,
      taxable = ?,
      requiresHRApproval = ?,
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
      profile.calculationBase,
      profile.value,
      profile.taxable,
      profile.requiresHRApproval,
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

/*
 * ============================================================
 * SYNC LOOKUPS
 * ============================================================
 *
 * These functions intentionally DO NOT filter isDeleted.
 *
 * During a pull sync, a remotely deleted profile still needs
 * to be found locally so that it can be updated as deleted
 * instead of being inserted as a new record.
 */

/**
 * Get a payroll employee profile by its exact _id.
 *
 * Used by sync/upsert logic.
 */
export async function getEmployeePayrollProfileById(
  _id: string
): Promise<PayrollEmployeeProfile | null> {
  return await get<PayrollEmployeeProfile>(
    `
    SELECT *
    FROM payroll_employee_profiles
    WHERE _id = ?
    `,
    [_id]
  );
}

/**
 * Get a payroll employee profile using its business identity:
 *
 * employeeId + componentId
 *
 * This is necessary because a local profile and its remote
 * counterpart may have different _ids.
 */
export async function getEmployeePayrollProfileByEmployeeAndComponent(
  employeeId: string,
  componentId: string
): Promise<PayrollEmployeeProfile | null> {
  return await get<PayrollEmployeeProfile>(
    `
    SELECT *
    FROM payroll_employee_profiles
    WHERE employeeId = ?
      AND componentId = ?
    LIMIT 1
    `,
    [employeeId, componentId]
  );
}

/*
 * ============================================================
 * PULL SYNC UPSERT
 * ============================================================
 */

export async function upsertEmployeePayrollProfile(
  profile: PayrollEmployeeProfile
) {
  /*
   * 1. First find the exact record by _id.
   */
  if (!profile._id) return;
  let local = await getEmployeePayrollProfileById(profile._id);

  /*
   * 2. If the _id doesn't exist locally, find the existing
   *    record using employeeId + componentId.
   *
   */
  if (!local) {
    local = await getEmployeePayrollProfileByEmployeeAndComponent(
      profile.employeeId,
      profile.componentId
    );
  }

  /*
   * 3. Existing local record.
   */
  if (local && local._id) {
    const localVersion = Number(local.serverVersion ?? 0);
    const remoteVersion = Number(profile.serverVersion ?? 0);

    /*
     * Never overwrite a newer local version with an older
     * remote version.
     */
    if (remoteVersion < localVersion) {
      console.log(
        `SKIPPING REMOTE PAYROLL EMPLOYEE PROFILE. LOCAL VERSION IS NEWER: ${profile._id}`,
        {
          localId: local._id,
          remoteId: profile._id,
          localVersion,
          remoteVersion,
        }
      );

      return local;
    }

    await run(
      `
      UPDATE payroll_employee_profiles
      SET
        employeeId = ?,
        componentId = ?,
        name = ?,
        displayName = ?,
        displayOrder = ?,
        type = ?,
        calculationType = ?,
        calculationBase = ?,
        value = ?,
        taxable = ?,
        requiresHRApproval = ?,
        enabled = ?,
        isOverridden = ?,
        synced = 1,
        isDeleted = ?,
        serverVersion = ?,
        createdAt = ?,
        updatedAt = ?,
        lastSyncedAt = CURRENT_TIMESTAMP
      WHERE _id = ?
      `,
      [
        profile.employeeId,
        profile.componentId,
        profile.name,
        profile.displayName,
        profile.displayOrder,
        profile.type,
        profile.calculationType,
        profile.calculationBase,
        profile.value,
        profile.taxable,
        profile.requiresHRApproval,
        profile.enabled,
        profile.isOverridden ?? 0,
        profile.isDeleted ?? 0,
        profile.serverVersion ?? 0,
        profile.createdAt,
        profile.updatedAt,
        local._id,
      ]
    );

    return await getEmployeePayrollProfileById(local._id);
  }

  /*
   * 4. No matching local record exists.
   *
   */
  await run(
    `
    INSERT INTO payroll_employee_profiles (
      _id,
      employeeId,
      componentId,
      name,
      displayName,
      displayOrder,
      type,
      calculationType,
      calculationBase,
      value,
      taxable,
      requiresHRApproval,
      enabled,
      isOverridden,
      synced,
      isDeleted,
      serverVersion,
      createdAt,
      updatedAt,
      lastSyncedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    [
      profile._id,
      profile.employeeId,
      profile.componentId,
      profile.name,
      profile.displayName,
      profile.displayOrder,
      profile.type,
      profile.calculationType,
      profile.calculationBase,
      profile.value,
      profile.taxable,
      profile.requiresHRApproval,
      profile.enabled,
      profile.isOverridden ?? 0,
      1,
      profile.isDeleted ?? 0,
      profile.serverVersion ?? 0,
      profile.createdAt,
      profile.updatedAt,
    ]
  );

  return await getEmployeePayrollProfileById(profile._id);
}

export async function upsertManyEmployeePayrollProfiles(
  profiles: PayrollEmployeeProfile[]
) {
  for (const profile of profiles) {
    await upsertEmployeePayrollProfile(profile);
  }
}

// Get all employee payroll inputs
export async function getAllEmployeePayrollInputs(): Promise<
  PayrollEmployeeInput[]
> {
  const rows = await all<
    PayrollEmployeeProfile & {
      employeeName?: string;
    }
  >(
    `
    SELECT *
    FROM payroll_employee_profiles
    WHERE
      isDeleted = 0
      AND enabled = 1
    ORDER BY employeeId, displayOrder
    `
  );

  const employees = new Map<string, PayrollEmployeeInput>();

  for (const row of rows) {
    let employee = employees.get(row.employeeId);

    if (!employee) {
      employee = {
        employeeId: row.employeeId,
        baseSalary: 0,
        components: [],
      };

      employees.set(row.employeeId, employee);
    }

    // Base salary is the value of the BASE_SALARY component
    if (row.name === "BASE_SALARY") {
      employee.baseSalary = row.value ?? 0;
      continue;
    }

    employee.components.push({
      _id: row.componentId,
      name: row.name,
      displayName: row.displayName,
      displayOrder: row.displayOrder,
      type: row.type,
      calculationType: row.calculationType,
      calculationBase: row.calculationBase,
      enabled: row.enabled ?? 0,
      taxable: row.taxable,
      value: row.value ?? 0,
    });
  }

  return [...employees.values()];
}

export async function getEmployeePayrollProfile(_id: string) {
  return await get<PayrollEmployeeProfile>(
    `
    SELECT *
    FROM payroll_employee_profiles
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
    FROM payroll_employee_profiles
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
    FROM payroll_employee_profiles
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
      FROM payroll_employee_profiles
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
    FROM payroll_employee_profiles
    ORDER BY displayOrder
    `
  );
}

export async function getUnsyncedEmployeePayrollProfiles() {
  return await all<PayrollEmployeeProfile>(
    `
    SELECT *
    FROM payroll_employee_profiles
    WHERE synced = 0
    `
  );
}

export async function markPayrollEmployeeProfileSynced(_id: string) {
  await run(
    `
    UPDATE payroll_employee_profiles
    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );
}

export async function markManyPayrollEmployeeProfileSynced(ids: string[]) {
  for (const id of ids) {
    await markPayrollEmployeeProfileSynced(id);
  }
}

export async function deleteEmployeePayrollProfile(_id: string) {
  const now = new Date().toISOString();

  await run(
    `
    UPDATE payroll_employee_profiles
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
    `,
    [now, _id]
  );

  const payroll_profile = await get<PayrollEmployeeProfile>(
    `
      SELECT *
      FROM payroll_employee_profiles
      WHERE _id = ?
      `,
    [_id]
  );

  console.log("DELETED PAYROLL PROFILE TO SAVE TO SYNC QUEUE", payroll_profile);

  await addToSyncQueue({
    entity: "payroll_profile",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({
      _id,
      updatedAt: now,
      serverVersion: payroll_profile?.serverVersion ?? 0,
    }),
  });
}

export async function restoreEmployeePayrollProfile(_id: string) {
  await run(
    `
    UPDATE payroll_employee_profiles
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
    DELETE FROM payroll_employee_profiles
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
    FROM payroll_employee_profiles
    WHERE isDeleted = 0
    `
  );

  return result?.count ?? 0;
}
