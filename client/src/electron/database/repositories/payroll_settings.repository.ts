import { randomUUID } from "crypto";
import { all, get, run } from "../db.js";
import { addToSyncQueue } from "./sync.repository.js";
import { PayrollSettings } from "../../../common/types/payroll/Payroll.js";

const ENTITY = "payroll_settings";

export async function getPayrollSettings(): Promise<PayrollSettings | null> {
  const settings = await get<PayrollSettings>(
    `
    SELECT
      _id,
      currency,
      workingDays,
      workingHours,
      paymentDay,
      synced,
      createdAt,
      updatedAt,
      lastSyncedAt,
      isDeleted
    FROM payroll_settings
    WHERE isDeleted = 0
    ORDER BY createdAt ASC
    LIMIT 1
    `
  );

  return settings ?? null;
}

export async function getPayrollSettingsById(
  _id: string
): Promise<PayrollSettings | null> {
  const settings = await get<PayrollSettings>(
    `
    SELECT
      _id,
      currency,
      workingDays,
      workingHours,
      paymentDay,
      synced,
      createdAt,
      updatedAt,
      lastSyncedAt,
      isDeleted
    FROM payroll_settings
    WHERE _id = ?
    `,
    [_id]
  );

  return settings ?? null;
}

export async function createPayrollSettings(
  data: Omit<
    PayrollSettings,
    "_id" | "synced" | "createdAt" | "updatedAt" | "lastSyncedAt" | "isDeleted"
  >
): Promise<PayrollSettings> {
  // Payroll settings should be a singleton.
  const existing = await getPayrollSettings();

  if (existing) {
    throw new Error("PAYROLL SETTINGS ALREADY EXIST");
  }

  const _id = randomUUID();
  const now = new Date().toISOString();

  const settings: PayrollSettings = {
    _id,
    currency: data.currency,
    workingDays: data.workingDays,
    workingHours: data.workingHours,
    paymentDay: data.paymentDay,
    synced: 0,
    createdAt: now,
    updatedAt: now,
    isDeleted: 0,
  };

  await run(
    `
    INSERT INTO payroll_settings (
      _id,
      currency,
      workingDays,
      workingHours,
      paymentDay,
      synced,
      createdAt,
      updatedAt,
      isDeleted
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      settings._id,
      settings.currency,
      settings.workingDays,
      settings.workingHours,
      settings.paymentDay,
      settings.synced,
      settings.createdAt,
      settings.updatedAt,
      settings.isDeleted,
    ]
  );

  await addToSyncQueue({
    entity: ENTITY,
    entityId: settings._id,
    operation: "create",
    payload: JSON.stringify(settings),
  });

  return settings;
}

export async function upsertPayrollSettings(
  settings: PayrollSettings
): Promise<PayrollSettings> {
  const existing = await getPayrollSettingsById(settings._id);
  if (!existing) {
    await run(
      `
      INSERT INTO payroll_settings (
        _id,
        currency,
        workingDays,
        workingHours,
        paymentDay,
        synced,
        createdAt,
        updatedAt,
        lastSyncedAt,
        isDeleted
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        settings._id,
        settings.currency,
        settings.workingDays,
        settings.workingHours,
        settings.paymentDay,
        settings.synced ?? 1,
        settings.createdAt,
        settings.updatedAt,
        settings.lastSyncedAt ?? null,
        settings.isDeleted ?? 0,
      ]
    );

    return settings;
  }
  await run(
    `
    UPDATE payroll_settings
    SET
      currency = ?,
      workingDays = ?,
      workingHours = ?,
      paymentDay = ?,
      synced = ?,
      createdAt = ?,
      updatedAt = ?,
      lastSyncedAt = ?,
      isDeleted = ?
    WHERE _id = ?
    `,
    [
      settings.currency,
      settings.workingDays,
      settings.workingHours,
      settings.paymentDay,
      settings.synced ?? 1,
      settings.createdAt,
      settings.updatedAt,
      settings.lastSyncedAt ?? null,
      settings.isDeleted ?? 0,
      settings._id,
    ]
  );

  return settings;
}

export async function updatePayrollSettings(
  settings: PayrollSettings
): Promise<PayrollSettings> {
  const existing = await getPayrollSettingsById(settings._id);

  if (!existing) {
    throw new Error(`PAYROLL SETTINGS ${settings._id} NOT FOUND`);
  }

  const updatedAt = new Date().toISOString();

  const updatedSettings: PayrollSettings = {
    ...settings,
    updatedAt,
    synced: 0,
    isDeleted: 0,
  };

  await run(
    `
    UPDATE payroll_settings
    SET
      currency = ?,
      workingDays = ?,
      workingHours = ?,
      paymentDay = ?,
      synced = ?,
      updatedAt = ?,
      isDeleted = ?
    WHERE _id = ?
    `,
    [
      updatedSettings.currency,
      updatedSettings.workingDays,
      updatedSettings.workingHours,
      updatedSettings.paymentDay,
      updatedSettings.synced,
      updatedSettings.updatedAt,
      updatedSettings.isDeleted,
      updatedSettings._id,
    ]
  );

  await addToSyncQueue({
    entity: ENTITY,
    entityId: updatedSettings._id,
    operation: "update",
    payload: JSON.stringify(updatedSettings),
  });

  return updatedSettings;
}

export async function updatePayrollSettingsFields(
  _id: string,
  fields: Partial<
    Pick<
      PayrollSettings,
      "currency" | "workingDays" | "workingHours" | "paymentDay"
    >
  >
): Promise<PayrollSettings> {
  const existing = await getPayrollSettingsById(_id);

  if (!existing) {
    throw new Error(`PAYROLL SETTINGS ${_id} NOT FOUND`);
  }

  const updatedSettings: PayrollSettings = {
    ...existing,
    ...fields,
    updatedAt: new Date().toISOString(),
    synced: 0,
    isDeleted: 0,
  };

  await run(
    `
    UPDATE payroll_settings
    SET
      currency = ?,
      workingDays = ?,
      workingHours = ?,
      paymentDay = ?,
      synced = ?,
      updatedAt = ?,
      isDeleted = ?
    WHERE _id = ?
    `,
    [
      updatedSettings.currency,
      updatedSettings.workingDays,
      updatedSettings.workingHours,
      updatedSettings.paymentDay,
      updatedSettings.synced,
      updatedSettings.updatedAt,
      updatedSettings.isDeleted,
      updatedSettings._id,
    ]
  );

  await addToSyncQueue({
    entity: ENTITY,
    entityId: updatedSettings._id,
    operation: "update",
    payload: JSON.stringify(updatedSettings),
  });

  return updatedSettings;
}

export async function deletePayrollSettings(_id: string): Promise<void> {
  const existing = await getPayrollSettingsById(_id);

  if (!existing) {
    throw new Error(`PAYROLL SETTINGS ${_id} NOT FOUND`);
  }

  const updatedAt = new Date().toISOString();

  const deletedSettings: PayrollSettings = {
    ...existing,
    isDeleted: 1,
    synced: 0,
    updatedAt,
  };

  await run(
    `
    UPDATE payroll_settings
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
    `,
    [updatedAt, _id]
  );

  await addToSyncQueue({
    entity: ENTITY,
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify(deletedSettings),
  });
}

export async function restorePayrollSettings(
  _id: string
): Promise<PayrollSettings> {
  const existing = await getPayrollSettingsById(_id);

  if (!existing) {
    throw new Error(`PAYROLL SETTINGS ${_id} NOT FOUND`);
  }

  const updatedAt = new Date().toISOString();

  const restoredSettings: PayrollSettings = {
    ...existing,
    isDeleted: 0,
    synced: 0,
    updatedAt,
  };

  await run(
    `
    UPDATE payroll_settings
    SET
      isDeleted = 0,
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
    `,
    [updatedAt, _id]
  );

  await addToSyncQueue({
    entity: ENTITY,
    entityId: _id,
    operation: "update",
    payload: JSON.stringify(restoredSettings),
  });

  return restoredSettings;
}

export async function markPayrollSettingsSynced(_id: string): Promise<void> {
  const now = new Date().toISOString();

  await run(
    `
    UPDATE payroll_settings
    SET
      synced = 1,
      lastSyncedAt = ?,
      updatedAt = updatedAt
    WHERE _id = ?
    `,
    [now, _id]
  );
}

export async function getUnsyncedPayrollSettings(): Promise<PayrollSettings[]> {
  return all<PayrollSettings>(
    `
    SELECT
      _id,
      currency,
      workingDays,
      workingHours,
      paymentDay,
      synced,
      createdAt,
      updatedAt,
      lastSyncedAt,
      isDeleted
    FROM payroll_settings
    WHERE synced = 0
    ORDER BY updatedAt ASC
    `
  );
}
