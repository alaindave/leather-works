import { all, get, run } from "../db.js";
import PayrollComponent from "../../../shared/types/payroll/PayrollComponent.js";
import CreatePayrollComponentDto from "../../../shared/types/payroll/CreatePayrollComponentDto.js";
import { randomUUID } from "crypto";
import { addToSyncQueue } from "./sync.repository.js";
import {
  addPayrollComponentToAllEmployees,
  updatePayrollComponentDefaults,
} from "../../services/payrollProfile.service.js";

export async function createPayrollComponent(
  component: CreatePayrollComponentDto
): Promise<PayrollComponent | null> {
  console.log("RECEIVED PAYROLL COMPONENT:", component);
  const _id = randomUUID();
  const now = new Date().toISOString();

  await run(
    `
      INSERT INTO payroll_components (
        _id,
        name,
        displayName,
        displayOrder,
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
      VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    [
      _id,
      component.name,
      component.displayName,
      component.displayOrder,
      component.type,
      component.calculationType,
      component.defaultValue,
      component.percentageOf,
      0,
      1,
      0,
      now,
      now,
      now,
      0,
    ]
  );

  const savedPayrollComponent = {
    _id,
    ...component,
    createdAt: now,
    updatedAt: now,
  };

  console.log("PAYROLL COMPONENT TO SAVE TO SYNC QUEUE", savedPayrollComponent);

  await addToSyncQueue({
    entity: "payroll_component",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedPayrollComponent),
  });

  const new_component = await getPayrollComponentById(_id);
  if (new_component) await addPayrollComponentToAllEmployees(new_component);

  return new_component;
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
      displayOrder,
      isSystem,
      enabled,
      synced,
      createdAt,
      updatedAt,
      lastSyncedAt,
      isDeleted
    )

    VALUES (?, ?, ?, ?, ?, ?,?, ?,?, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(_id)
    DO UPDATE SET

      name = excluded.name,
      displayName = excluded.displayName,
      type = excluded.type,
      calculationType = excluded.calculationType,
      defaultValue = excluded.defaultValue,
      percentageOf = excluded.percentageOf,
      displayOrder = excluded.displayOrder,
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
      component.displayOrder,
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

export async function getPayrollComponentById(
  _id: string
): Promise<PayrollComponent | null> {
  return await get(
    `
    SELECT *
    FROM payroll_components
    WHERE _id = ?

    `,
    [_id]
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

export async function updatePayrollComponents(components: PayrollComponent[]) {
  console.log("COMPONENTS TO UPDATE:", components);
  const now = new Date().toISOString();
  for (const component of components) {
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

    const updatedPayrollComponent = {
      ...component,
      _id: component._id,
      updatedAt: now,
    };

    console.log(
      "PAYROLL COMPONENT TO SAVE TO SYNC QUEUE",
      updatedPayrollComponent
    );

    await addToSyncQueue({
      entity: "payroll_component",
      entityId: component._id,
      operation: "update",
      payload: JSON.stringify(updatedPayrollComponent),
    });

    await updatePayrollComponentDefaults(component);
  }

  return components;
}

export async function deletePayrollComponent(_id: string) {
  const now = new Date().toISOString();
  await run(
    `
    UPDATE payroll_components

    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = CURRENT_TIMESTAMP

    WHERE _id = ?
    `,
    [_id]
  );

  console.log("PAYROLL COMPONENT DELETION:", {
    _id,
    deleted: true,
    updatedAt: now,
  });

  await addToSyncQueue({
    entity: "payroll_component",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({
      _id,
      updatedAt: now,
    }),
  });
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

export async function markPayrollComponentSynced(_id: string) {
  await run(
    `
    UPDATE payroll_components

    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP

    WHERE _id = ?
    `,
    [_id]
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
