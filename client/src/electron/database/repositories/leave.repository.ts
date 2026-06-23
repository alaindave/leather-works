import type Leave from "../../../shared/types/Leave.js";
import { randomUUID } from "crypto";
import { all, get, run } from "../db.js";
import { getEmployeeById } from "./employee.repository.js";
import { addToSyncQueue } from "./sync.repository.js";

export async function createLeave(leave: Partial<Leave>) {
  const employee = await getEmployeeById(leave.employeeId!);
  if (!employee) {
    throw new Error("No employee found with the given ID");
  }
  const today = new Date();

  const submittedAt = today.toISOString().split("T")[0];
  const createdAt = today.toISOString();

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const submittedMonth = `${year}-${month}`;

  const _id = randomUUID();

  await run(
    `
    INSERT INTO leaves (
      _id,
      employeeId,
      submittedAt,
      submittedMonth,
      startDate,
      endDate,
      subject,
      notes,
      synced,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?,?, ?,?,?, 0, 0, datetime('now'), datetime('now'))
    `,
    [
      _id,
      leave.employeeId,
      submittedAt,
      submittedMonth,
      leave.startDate,
      leave.endDate,
      leave.subject,
      leave.notes,
    ]
  );

  const savedLeave = { _id, ...leave, createdAt };

  console.log("Leave to save to sync queue", savedLeave);

  await addToSyncQueue({
    entity: "leave",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedLeave),
  });

  return getLeaveById(_id);
}

export async function getLeaveById(
  _id: string
): Promise<Leave | undefined | null> {
  return get(
    `
    SELECT
      l._id,
      l.employeeId,
      l.submittedAt,
      l.submittedMonth,
      l.startDate,
      l.endDate,
      l.subject,
      l.notes,
      l.status,
      e.firstName,
      e.lastName,
      e.department,
      e.role,
      e.remainingLeave
    FROM leaves l
    JOIN employees e
      ON l.employeeId = e._id
    WHERE l._id = ?
      AND l.isDeleted = 0
      AND e.isDeleted = 0
    ORDER BY l.submittedAt ASC
    `,
    [_id]
  );
}

export async function getAllLeave() {
  return all(`
    SELECT *
    FROM leaves
    WHERE isDeleted = 0
    ORDER BY date DESC
  `);
}

export async function getLeaveByEmployee(employeeId: string) {
  return all(
    `
    SELECT *
    FROM leaves
    WHERE employeeId = ?
      AND isDeleted = 0
    ORDER BY date DESC
    `,
    [employeeId]
  );
}

export async function getOngoingLeaves() {
  return all(
    `
SELECT * 
FROM leaves 
WHERE startDate <= date('now') 
  AND endDate >= date('now');

    `
  );
}

export async function getLeaveByMonth(month: string) {
  return all(
    `
    SELECT
      l._id,
      l.employeeId,
      l.submittedAt,
      l.submittedMonth,
      l.startDate,
      l.endDate,
      l.subject,
      l.notes,
      l.status,
      e.firstName,
      e.lastName,
      e.department,
      e.role,
      e.remainingLeave
    FROM leaves l
    JOIN employees e
      ON l.employeeId = e._id
    WHERE l.submittedMonth = ?
      AND l.isDeleted = 0
      AND e.isDeleted = 0
    ORDER BY l.submittedAt ASC
    `,
    [month]
  );
}

export async function getLeaveRecord(employeeId: string) {
  return get(
    `
    SELECT *
    FROM leaves
    WHERE employeeId = ?
      AND isDeleted = 0
    `,
    [employeeId]
  );
}

export async function updateLeave(
  _id: string,
  updates: {
    subject?: string;
    notes?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }
) {
  const existing = await getLeaveById(_id);

  if (!existing) {
    throw new Error("Leave not found");
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (updates.subject !== undefined) {
    fields.push("subject = ?");
    values.push(updates.subject);
  }

  if (updates.notes !== undefined) {
    fields.push("notes = ?");
    values.push(updates.notes);
  }

  if (updates.startDate !== undefined) {
    fields.push("startDate = ?");
    values.push(updates.startDate);
  }

  if (updates.endDate !== undefined) {
    fields.push("endDate = ?");
    values.push(updates.endDate);
  }

  if (updates.status !== undefined) {
    fields.push("status = ?");
    values.push(updates.status);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push("synced = 0");
  fields.push("updatedAt = datetime('now')");

  values.push(_id);

  await run(
    `
    UPDATE leaves
    SET ${fields.join(", ")}
    WHERE _id = ?
      AND isDeleted = 0
    `,
    values
  );

  return getLeaveById(_id);
}

export async function deleteLeave(_id: string) {
  await run(
    `
    UPDATE leaves
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = datetime('now')
    WHERE _id = ?
    `,
    [_id]
  );

  return true;
}

export async function upsertLeave(leave: Leave) {
  const local = await getLeaveById(leave._id);

  // If local exists, apply conflict rule
  if (local && local.updatedAt && leave.updatedAt) {
    const localTime = new Date(local.updatedAt).getTime();
    const remoteTime = new Date(leave.updatedAt).getTime();

    // Keep newest local change
    if (remoteTime < localTime) {
      console.log(`Skipping leave update (local is newer): ${leave._id}`);
      return local;
    }
  }

  await run(
    `
    INSERT INTO leaves (
      _id,
      employeeId,
      submittedAt,
      submittedMonth,
      startDate,
      endDate,
      subject,
      notes,
      status,
      synced,
      isDeleted,
      createdAt,
      updatedAt,
      lastSyncedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    ON CONFLICT(_id)
    DO UPDATE SET
      employeeId = excluded.employeeId,
      submittedAt = excluded.submittedAt,
      submittedMonth = excluded.submittedMonth,
      startDate = excluded.startDate,
      endDate = excluded.endDate,
      subject = excluded.subject,
      notes = excluded.notes,
      status = excluded.status,
      isDeleted = excluded.isDeleted,
      synced = 1,
      updatedAt = excluded.updatedAt,
      lastSyncedAt = excluded.lastSyncedAt
    `,
    [
      leave._id,
      leave.employeeId,
      leave.submittedAt,
      leave.submittedMonth,
      leave.startDate,
      leave.endDate,
      leave.subject,
      leave.notes,
      leave.status,
      leave.isDeleted ?? 0,
      leave.createdAt ?? new Date().toISOString(),
      leave.updatedAt ?? new Date().toISOString(),
      new Date().toISOString(),
    ]
  );

  return getLeaveById(leave._id);
}

export async function markLeaveSynced(_id: string) {
  await run(
    `
    UPDATE leaves
    SET
      synced = 1,
      updatedAt = datetime('now')
    WHERE _id = ?
    `,
    [_id]
  );

  return true;
}
