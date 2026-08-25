import type Leave from "../../../common/types/Leave.js";
import { randomUUID } from "crypto";
import { all, get, run } from "../db.js";
import { getEmployeeById } from "./employees.repository.js";
import { addToSyncQueue } from "./sync.repository.js";

export async function createLeave(leave: Partial<Leave>) {
  const employee = await getEmployeeById(leave.employeeId!);

  if (!employee) {
    throw new Error("No employee found with the given ID");
  }

  console.log("LEAVE TO CREATE:", leave);

  const today = new Date();
  const submittedAt = today.toISOString();
  const time = today.toISOString();

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const submittedMonth = `${year}-${month}`;

  const _id = randomUUID();

  /*
   * Local changes start at serverVersion 0.
   *
   * The server assigns the real serverVersion when the
   * entity is pushed successfully.
   */
  const serverVersion = 0;

  await run(
    `
    INSERT INTO leaves (
      _id,
      employeeId,
      submittedAt,
      submittedMonth,
      startDate,
      endDate,
      status,
      subject,
      notes,
      serverVersion,
      synced,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `,
    [
      _id,
      leave.employeeId,
      submittedAt,
      submittedMonth,
      leave.startDate,
      leave.endDate,
      leave.status ?? "ATTENTE_APPROBATION",
      leave.subject,
      leave.notes,
      serverVersion,
      time,
      time,
    ]
  );

  const savedLeave = {
    _id,
    ...leave,
    employeeId: leave.employeeId,
    status: leave.status ?? "ATTENTE_APPROBATION",
    submittedAt,
    submittedMonth,
    serverVersion,
    createdAt: time,
    updatedAt: time,
    isDeleted: 0,
  };

  console.log("LEAVE TO SAVE TO SYNC QUEUE", savedLeave);

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
      l.serverVersion,
      l.createdAt,
      l.updatedAt,
      l.isDeleted,
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
    ORDER BY submittedAt DESC
  `);
}

export async function getLeaveByEmployeeId(employeeId: string) {
  return all(
    `
    SELECT *
    FROM leaves
    WHERE employeeId = ?
      AND isDeleted = 0
    ORDER BY submittedAt DESC
    `,
    [employeeId]
  );
}

export async function getOngoingLeaves(date: string): Promise<Leave[]> {
  return all(
    `
    SELECT *
    FROM leaves
    WHERE startDate <= date(?)
      AND endDate >= date(?)
      AND status = 'APPROUVÉ'
      AND isDeleted = 0
    `,
    [date, date]
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
      l.serverVersion,
      l.createdAt,
      l.updatedAt,
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

export async function cancelLeave(_id: string) {
  const leave = await getLeaveById(_id);

  if (!leave) {
    throw new Error("LEAVE NOT FOUND");
  }

  if (leave.status === "ANNULÉ") {
    return leave;
  }

  /*
   * Cancel a leave that was not yet approved.
   */
  if (leave.status !== "APPROUVÉ") {
    const updatedAt = new Date().toISOString();

    await run(
      `
      UPDATE leaves
      SET
        status = 'ANNULÉ',
        synced = 0,
        updatedAt = ?
      WHERE _id = ?
        AND isDeleted = 0
      `,
      [updatedAt, _id]
    );

    const updatedLeave = await getLeaveById(_id);

    await addToSyncQueue({
      entity: "leave",
      entityId: _id,
      operation: "update",
      payload: JSON.stringify({
        _id,
        employeeId: leave.employeeId,
        status: "ANNULÉ",
        serverVersion: leave.serverVersion ?? 0,
        updatedAt,
      }),
    });

    return updatedLeave;
  }

  /*
   * Calculate the number of approved leave days
   * that need to be returned to the employee.
   */
  const startDate = new Date(leave.startDate);
  const endDate = new Date(leave.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error("INVALID LEAVE DATES");
  }

  const differenceInMs = endDate.getTime() - startDate.getTime();

  const leaveDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)) + 1;

  if (leaveDays <= 0) {
    throw new Error("INVALID LEAVE PERIOD");
  }

  const employee = await getEmployeeById(leave.employeeId);

  if (!employee) {
    throw new Error("EMPLOYEE NOT FOUND");
  }

  const updatedAt = new Date().toISOString();

  /*
   * Restore deducted leave days.
   */
  await run(
    `
    UPDATE employees
    SET
      remainingLeave = remainingLeave + ?,
      updatedAt = ?,
      synced = 0
    WHERE _id = ?
      AND isDeleted = 0
    `,
    [leaveDays, updatedAt, leave.employeeId]
  );

  /*
   * Cancel the leave.
   */
  await run(
    `
    UPDATE leaves
    SET
      status = 'ANNULÉ',
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
      AND isDeleted = 0
    `,
    [updatedAt, _id]
  );

  /*
   * Queue leave update.
   *
   * Keep the serverVersion currently known locally.
   * The server will assign the next version when pushed.
   */
  await addToSyncQueue({
    entity: "leave",
    entityId: _id,
    operation: "update",
    payload: JSON.stringify({
      _id,
      employeeId: leave.employeeId,
      status: "ANNULÉ",
      serverVersion: leave.serverVersion ?? 0,
      updatedAt,
    }),
  });

  /*
   * Queue employee balance update separately.
   */
  const updatedEmployee = await getEmployeeById(leave.employeeId);

  if (updatedEmployee) {
    await addToSyncQueue({
      entity: "employee",
      entityId: leave.employeeId,
      operation: "update",
      payload: JSON.stringify({
        _id: leave.employeeId,
        remainingLeave: updatedEmployee.remainingLeave,
        updatedAt,
        serverVersion: updatedEmployee.serverVersion ?? 0,
      }),
    });
  }

  return getLeaveById(_id);
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
    throw new Error("LEAVE NOT FOUND");
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

  /*
   * Local modification.
   *
   * Do NOT modify serverVersion here.
   * serverVersion represents the version assigned by
   * the server, not the number of local edits.
   */
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

  const savedUpdates = {
    _id,
    employeeId: existing.employeeId,
    ...updates,
    serverVersion: existing.serverVersion ?? 0,
    updatedAt,
  };

  console.log("LEAVE TO SAVE TO SYNC QUEUE", savedUpdates);

  await addToSyncQueue({
    entity: "leave",
    entityId: _id,
    operation: "update",
    payload: JSON.stringify(savedUpdates),
  });

  return getLeaveById(_id);
}

export async function deleteLeave(_id: string) {
  const existing = await getLeaveById(_id);

  if (!existing) {
    throw new Error("LEAVE NOT FOUND");
  }

  const now = new Date().toISOString();

  await run(
    `
    UPDATE leaves
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
    `,
    [now, _id]
  );

  const deletedLeave = {
    _id,
    employeeId: existing.employeeId,
    serverVersion: existing.serverVersion ?? 0,
    updatedAt: now,
    deletedAt: now,
    isDeleted: 1,
  };

  console.log("LEAVE TO DELETE FROM SYNC QUEUE", deletedLeave);

  await addToSyncQueue({
    entity: "leave",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify(deletedLeave),
  });

  return getLeaveById(_id);
}

export async function upsertLeave(leave: Leave) {
  /*
   * Find the local record by ID.
   */
  const local = await getLeaveById(leave._id);

  console.log("PULLED LEAVE TO SYNC:", leave);

  /*
   * SERVER VERSION IS NOW THE SOURCE OF TRUTH.
   *
   * Never compare updatedAt for synchronization.
   *
   * A remote record is newer when:
   *
   * remote.serverVersion > local.serverVersion
   *
   * If the versions are equal, the local record is already
   * at the same server state.
   */
  if (local) {
    const localVersion = Number(local.serverVersion ?? 0);
    const remoteVersion = Number(leave.serverVersion ?? 0);

    if (remoteVersion <= localVersion) {
      console.log(
        `SKIPPING LEAVE ${leave._id}: ` +
          `LOCAL SERVER VERSION ${localVersion} >= REMOTE ${remoteVersion}`
      );

      return local;
    }
  }

  /*
   * Insert or update the complete server representation.
   */
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
      serverVersion,
      isDeleted,
      createdAt,
      updatedAt,
      synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
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
      serverVersion = excluded.serverVersion,
      isDeleted = excluded.isDeleted,
      createdAt = excluded.createdAt,
      updatedAt = excluded.updatedAt,
      synced = 1
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
      leave.serverVersion ?? 0,
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
      synced = 1
    WHERE _id = ?
    `,
    [_id]
  );

  return true;
}
