import type Leave from "@shared/types/Leave";
import { randomUUID } from "crypto";
import { all, get, run } from "../db.cjs";
import { getEmployeeById } from "../repositories/employee.repository.cjs";

export async function createLeave(
  employeeId: string,
  startDate: string,
  endDate: string,
  subject: string,
  notes: string
) {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new Error("No employee found with the given ID");
  }
  const today = new Date();

  const submittedAt = today.toISOString().split("T")[0];

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const submittedMonth = `${year}-${month}`;

  const leaveId = randomUUID();

  await run(
    `
    INSERT INTO leave (
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
      leaveId,
      employeeId,
      submittedAt,
      submittedMonth,
      startDate,
      endDate,
      subject,
      notes,
    ]
  );
  return getLeaveById(leaveId);
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
    FROM leave l
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
    FROM leave
    WHERE isDeleted = 0
    ORDER BY date DESC
  `);
}

export async function getLeaveByEmployee(employeeId: string) {
  return all(
    `
    SELECT *
    FROM leave
    WHERE employeeId = ?
      AND isDeleted = 0
    ORDER BY date DESC
    `,
    [employeeId]
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
    FROM leave l
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
    FROM leave
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
    UPDATE leave
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
    UPDATE leave
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
