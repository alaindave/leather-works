import { all, get, run } from "../db.js";
import PayrollComponent from "../../../shared/types/payroll/PayrollComponent.js";

export async function createPayrollComponent(component: PayrollComponent) {
  await run(
    `
    INSERT INTO payroll_components (
      _id,
      name,
      displayName,
      type,
      calculationType,
      defaultValue,
      percentageOf,
      isSystem,
      enabled,
      synced,
      createdAt,
      updatedAt,
      lastSyncedAt,
      isDeleted

    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      component._id,
      component.name,
      component.displayName,
      component.type,
      component.calculationType,
      component.defaultValue,
      component.percentageOf,
      component.isSystem,
      component.enabled,
      component.synced,
      component.createdAt,
      component.updatedAt,
      component.lastSyncedAt,
      component.isDeleted,
    ]
  );

  return component;
}

export async function upsertPayrollComponent(component: PayrollComponent) {
  await run(
    `
    INSERT INTO payroll_components (
      _id,
      name,
      displayName,
      type,
      calculationType,
      defaultValue,
      percentageOf,
      isSystem,
      enabled,
      synced,
      createdAt,
      updatedAt,
      lastSyncedAt,
      isDeleted
    )

    VALUES (?, ?, ?,?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(_id)
    DO UPDATE SET

      name = excluded.name,
      displayName = excluded.displayName,
      type = excluded.type,
      calculationType = excluded.calculationType,
      defaultValue = excluded.defaultValue,
      percentageOf = excluded.percentageOf,
      isSystem = excluded.isSystem,
      enabled = excluded.enabled,
      synced = excluded.synced,
      createdAt = excluded.createdAt,
      updatedAt = excluded.updatedAt,
      lastSyncedAt = excluded.lastSyncedAt,
      isDeleted = excluded.isDeleted

    `,
    [
      component._id,
      component.name,
      component.displayName,
      component.type,
      component.calculationType,
      component.defaultValue,
      component.percentageOf,
      component.isSystem,
      component.enabled,
      component.synced,
      component.createdAt,
      component.updatedAt,
      component.lastSyncedAt,
      component.isDeleted,
    ]
  );
}

export async function getPayrollComponents(
  type?: "EARNING" | "DEDUCTION"
): Promise<PayrollComponent[]> {
  if (type) {
    return await all(
      `
      SELECT *
      FROM payroll_components
      WHERE
        isDeleted = 0
        AND type = ?
      ORDER BY displayOrder ASC
      `,
      [type]
    );
  }

  return await all(
    `
    SELECT *
    FROM payroll_components
    WHERE isDeleted = 0
    ORDER BY displayOrder ASC
    `
  );
}

export async function getPayrollComponentById(
  id: string
): Promise<PayrollComponent | null> {
  return await get(
    `
    SELECT *
    FROM payroll_components
    WHERE _id = ?
    `,
    [id]
  );
}

export async function updatePayrollComponent(component: PayrollComponent) {
  await run(
    `
    UPDATE payroll_components

    SET
      name = ?,
      displayName = ?,
      type = ?,
      calculationType = ?,
      defaultValue = ?,
      percentageOf = ?,
      enabled = ?,
      synced = 0,
      updatedAt = CURRENT_TIMESTAMP

    WHERE _id = ?
    `,
    [
      component.name,
      component.displayName,
      component.type,
      component.calculationType,
      component.defaultValue,
      component.percentageOf,
      component.enabled,
      component._id,
    ]
  );
}

export async function deletePayrollComponent(id: string) {
  await run(
    `
    UPDATE payroll_components

    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = CURRENT_TIMESTAMP

    WHERE _id = ?
    `,
    [id]
  );
}

export async function enablePayrollComponent(id: string) {
  await run(
    `
    UPDATE payroll_components

    SET
      enabled = 1,
      synced = 0,
      updatedAt = CURRENT_TIMESTAMP

    WHERE _id = ?
    `,
    [id]
  );
}

export async function disablePayrollComponent(id: string) {
  await run(
    `
    UPDATE payroll_components

    SET
      enabled = 0,
      synced = 0,
      updatedAt = CURRENT_TIMESTAMP

    WHERE _id = ?
    `,
    [id]
  );
}

export async function markPayrollComponentSynced(id: string) {
  await run(
    `
    UPDATE payroll_components

    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP

    WHERE _id = ?
    `,
    [id]
  );
}

export async function getUnsyncedPayrollComponents(): Promise<
  PayrollComponent[]
> {
  return await all(
    `
    SELECT *
    FROM payroll_components
    WHERE
      synced = 0
      AND isDeleted = 0
    `
  );
}

export async function getEnabledPayrollComponents(
  type?: "EARNING" | "DEDUCTION"
): Promise<PayrollComponent[]> {
  if (type) {
    return await all(
      `
      SELECT *
      FROM payroll_components
      WHERE
        enabled = 1
        AND isDeleted = 0
        AND type = ?
      ORDER BY displayOrder
      `,
      [type]
    );
  }

  return await all(
    `
    SELECT *
    FROM payroll_components
    WHERE
      enabled = 1
      AND isDeleted = 0
    ORDER BY displayOrder
    `
  );
}
