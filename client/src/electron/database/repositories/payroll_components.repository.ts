import { all, get, run } from "../db.js";
import PayrollComponent, {
  CreatePayrollComponentDto,
} from "../../../common/types/payroll/PayrollComponent.js";
import { randomUUID } from "crypto";
import { addToSyncQueue } from "./sync.repository.js";
import {
  addPayrollComponentToAllEmployees,
  removeDeletedPayrollComponentsFromEmployeeProfiles,
  updatePayrollComponentDefaults,
} from "../../services/payroll/payrollProfile.service.js";

// ============================================================
// CREATE
// ============================================================

export async function createPayrollComponent(
  component: CreatePayrollComponentDto
): Promise<PayrollComponent | null> {
  console.log("RECEIVED PAYROLL COMPONENT:", component);

  const _id = randomUUID();
  const now = new Date().toISOString();

  /*
   * serverVersion is NULL/0 locally until the server accepts
   * the entity and assigns its first serverVersion.
   *
   * The client must never generate a serverVersion.
   */
  await run(
    `
      INSERT INTO payroll_components (
        _id,
        name,
        displayName,
        displayOrder,
        type,
        calculationType,
        calculationBase,
        defaultValue,
        taxable,
        isSystem,
        requiresHRApproval,
        enabled,
        synced,
        createdAt,
        updatedAt,
        lastSyncedAt,
        isDeleted
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
    [
      _id,
      component.name,
      component.displayName,
      component.displayOrder,
      component.type,
      component.calculationType,
      component.calculationBase,
      component.defaultValue,
      component.taxable ?? 1,
      0,
      component.requiresHRApproval ?? 0,
      1,
      0,
      now,
      now,
      null,
      0,
    ]
  );

  const savedPayrollComponent = {
    _id,
    ...component,
    createdAt: now,
    updatedAt: now,
    serverVersion: null,
    synced: 0,
    isDeleted: 0,
  };

  console.log("PAYROLL COMPONENT TO SAVE TO SYNC QUEUE", savedPayrollComponent);

  await addToSyncQueue({
    entity: "payroll_component",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedPayrollComponent),
  });

  const newComponent = await getPayrollComponentById(_id);

  // Add the new component to employee payroll profiles.
  if (newComponent) {
    await addPayrollComponentToAllEmployees(newComponent);
  }

  return newComponent;
}

// ============================================================
// UPSERT FROM SERVER
// ============================================================

export async function upsertPayrollComponent(component: PayrollComponent) {
  console.log("COMPONENT TO UPSERT:", component);

  await run(
    `
    INSERT INTO payroll_components (
      _id,
      name,
      displayName,
      type,
      calculationType,
      calculationBase,
      defaultValue,
      taxable,
      displayOrder,
      isSystem,
      requiresHRApproval,
      enabled,
      synced,
      createdAt,
      updatedAt,
      lastSyncedAt,
      serverVersion,
      isDeleted
    )

    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

    ON CONFLICT(_id)
    DO UPDATE SET

      name = excluded.name,
      displayName = excluded.displayName,
      type = excluded.type,
      calculationType = excluded.calculationType,
      calculationBase = excluded.calculationBase,
      defaultValue = excluded.defaultValue,
      taxable = excluded.taxable,
      displayOrder = excluded.displayOrder,
      isSystem = excluded.isSystem,
      requiresHRApproval = excluded.requiresHRApproval,
      enabled = excluded.enabled,
      synced = excluded.synced,
      createdAt = excluded.createdAt,
      updatedAt = excluded.updatedAt,
      lastSyncedAt = excluded.lastSyncedAt,
      serverVersion = excluded.serverVersion,
      isDeleted = excluded.isDeleted
    `,
    [
      component._id,
      component.name,
      component.displayName,
      component.type,
      component.calculationType,
      component.calculationBase,
      component.defaultValue,
      component.taxable ?? 1,
      component.displayOrder,
      component.isSystem,
      component.requiresHRApproval,
      component.enabled,
      component.synced,
      component.createdAt,
      component.updatedAt,
      component.lastSyncedAt ?? null,
      component.serverVersion ?? null,
      component.isDeleted ?? 0,
    ]
  );
}

// ============================================================
// GET BY ID
// ============================================================

export async function getPayrollComponentById(
  _id: string
): Promise<PayrollComponent | null> {
  return await get<PayrollComponent>(
    `
    SELECT *
    FROM payroll_components
    WHERE _id = ?
    `,
    [_id]
  );
}

// ============================================================
// GET ENABLED COMPONENTS
// ============================================================

export async function getEnabledPayrollComponents(
  type?: "EARNING" | "DEDUCTION"
): Promise<PayrollComponent[]> {
  if (type) {
    return await all<PayrollComponent>(
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

  return await all<PayrollComponent>(
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

// ============================================================
// GET ALL COMPONENTS
// ============================================================

export async function getPayrollComponents(
  type?: "EARNING" | "DEDUCTION"
): Promise<PayrollComponent[]> {
  if (type) {
    return await all<PayrollComponent>(
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

  return await all<PayrollComponent>(
    `
    SELECT *
    FROM payroll_components
    WHERE isDeleted = 0
    ORDER BY displayOrder ASC
    `
  );
}

// ============================================================
// UPDATE
// ============================================================

export async function updatePayrollComponents(components: PayrollComponent[]) {
  console.log("COMPONENTS TO UPDATE:", components);

  for (const component of components) {
    /*
     * updatedAt represents the moment the LOCAL entity was edited.
     *
     * Do not use CURRENT_TIMESTAMP here because we want the exact
     * client-side edit timestamp to be sent to the server.
     */
    const updatedAt = new Date().toISOString();

    await run(
      `
      UPDATE payroll_components

      SET
        name = ?,
        displayName = ?,
        displayOrder = ?,
        type = ?,
        calculationType = ?,
        calculationBase = ?,
        defaultValue = ?,
        taxable = ?,
        requiresHRApproval = ?,
        enabled = ?,
        synced = 0,
        updatedAt = ?

      WHERE _id = ?
      `,
      [
        component.name,
        component.displayName,
        component.displayOrder,
        component.type,
        component.calculationType,
        component.calculationBase,
        component.defaultValue,
        component.taxable ?? 1,
        component.requiresHRApproval ?? 0,
        component.enabled,
        updatedAt,
        component._id,
      ]
    );

    /*
     * IMPORTANT:
     *
     * We preserve the existing serverVersion here.
     *
     * If this component has already been synchronized, its old
     * serverVersion tells us which server version the client
     * currently knows about.
     *
     * The server will allocate a NEW serverVersion when it
     * receives this update.
     */
    const updatedPayrollComponent = {
      ...component,
      _id: component._id,
      updatedAt,
      serverVersion: component.serverVersion ?? null,
      synced: 0,
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

    // Update employee payroll profiles.
    await updatePayrollComponentDefaults(updatedPayrollComponent);
  }

  return components;
}

// ============================================================
// DELETE
// ============================================================

export async function deletePayrollComponent(_id: string) {
  const updatedAt = new Date().toISOString();

  /*
   * Soft delete locally.
   *
   * serverVersion remains the last serverVersion known by
   * this client. The server will assign a new version when
   * it receives the delete.
   */
  const component = await getPayrollComponentById(_id);

  await run(
    `
    UPDATE payroll_components

    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?

    WHERE _id = ?
    `,
    [updatedAt, _id]
  );

  console.log("PAYROLL COMPONENT DELETION:", {
    _id,
    deleted: true,
    updatedAt,
    serverVersion: component?.serverVersion ?? null,
  });

  await removeDeletedPayrollComponentsFromEmployeeProfiles();

  await addToSyncQueue({
    entity: "payroll_component",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({
      _id,
      updatedAt,
      serverVersion: component?.serverVersion ?? null,
      isDeleted: 1,
    }),
  });
}

// ============================================================
// ENABLE
// ============================================================

export async function enablePayrollComponent(id: string) {
  const updatedAt = new Date().toISOString();

  const component = await getPayrollComponentById(id);

  if (!component) {
    throw new Error(`PAYROLL COMPONENT NOT FOUND: ${id}`);
  }

  await run(
    `
    UPDATE payroll_components

    SET
      enabled = 1,
      synced = 0,
      updatedAt = ?

    WHERE _id = ?
    `,
    [updatedAt, id]
  );

  const updatedComponent = {
    ...component,
    enabled: 1,
    updatedAt,
    synced: 0,
    serverVersion: component.serverVersion ?? null,
  };

  await addToSyncQueue({
    entity: "payroll_component",
    entityId: id,
    operation: "update",
    payload: JSON.stringify(updatedComponent),
  });

  return getPayrollComponentById(id);
}

// ============================================================
// DISABLE
// ============================================================

export async function disablePayrollComponent(id: string) {
  const updatedAt = new Date().toISOString();

  const component = await getPayrollComponentById(id);

  if (!component) {
    throw new Error(`PAYROLL COMPONENT NOT FOUND: ${id}`);
  }

  await run(
    `
    UPDATE payroll_components

    SET
      enabled = 0,
      synced = 0,
      updatedAt = ?

    WHERE _id = ?
    `,
    [updatedAt, id]
  );

  const updatedComponent = {
    ...component,
    enabled: 0,
    updatedAt,
    synced: 0,
    serverVersion: component.serverVersion ?? null,
  };

  await addToSyncQueue({
    entity: "payroll_component",
    entityId: id,
    operation: "update",
    payload: JSON.stringify(updatedComponent),
  });

  return getPayrollComponentById(id);
}

// ============================================================
// MARK SYNCED
// ============================================================

export async function markPayrollComponentSynced(
  _id: string,
  serverVersion?: number
) {
  await run(
    `
    UPDATE payroll_components

    SET
      synced = 1,
      lastSyncedAt = ?,
      serverVersion = COALESCE(?, serverVersion)

    WHERE _id = ?
    `,
    [new Date().toISOString(), serverVersion ?? null, _id]
  );

  return true;
}

// ============================================================
// GET UNSYNCED COMPONENTS
// ============================================================

export async function getUnsyncedPayrollComponents(): Promise<
  PayrollComponent[]
> {
  return await all<PayrollComponent>(
    `
    SELECT *
    FROM payroll_components
    WHERE
      synced = 0
      AND isDeleted = 0
    `
  );
}
