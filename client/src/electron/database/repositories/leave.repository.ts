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
  const time = today.toISOString();
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

  const savedLeave = {
    _id,
    ...leave,
    submittedAt,
    submittedMonth,
    createdAt: time,
    updatedAt: time,
  };

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

  const updatedAt = new Date().toISOString();

  const savedUpdates = { _id, ...updates, updatedAt };

  console.log("Leave to save to sync queue", savedUpdates);

  await addToSyncQueue({
    entity: "leave",
    entityId: _id,
    operation: "update",
    payload: JSON.stringify(savedUpdates),
  });

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

  const deletedAt = new Date().toISOString();

  const deletedLeave = { _id, deletedAt };

  console.log("Leave to delete from sync queue", deletedLeave);

  await addToSyncQueue({
    entity: "leave",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify(deletedLeave),
  });

  return getLeaveById(_id);
}

export async function upsertLeave(leave: Leave) {
  const local = await getLeaveById(leave._id);
  console.log("pulled leave to sync", leave);

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
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      createdAt = excluded.createdAt,
      updatedAt = excluded.updatedAt
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
      leave.createdAt,
      leave.updatedAt,
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
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );

  return true;
}
