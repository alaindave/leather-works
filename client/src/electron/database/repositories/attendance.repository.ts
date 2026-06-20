import type Attendance from "../../../shared/types/Attendance.js";
import { randomUUID } from "crypto";
import { all, get, run } from "../db.js";
import { getEmployeeById } from "./employee.repository.js";

export async function createAttendance(employeeId: string, clockIn: string) {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new Error("No employee found with the given ID");
  }
  const today = new Date().toISOString().split("T")[0];
  const existingAttendance = await getAttendanceRecord(employeeId, today);

  if (existingAttendance) {
    throw new Error("The employee has already clocked in");
  }

  const clockInDate = new Date(clockIn);

  const scheduledHour = 8;
  const scheduledMinute = 0;

  const expectedMinutes = scheduledHour * 60 + scheduledMinute;

  const actualMinutes = clockInDate.getHours() * 60 + clockInDate.getMinutes();

  const lateMinutes = Math.max(0, actualMinutes - expectedMinutes);

  const status = lateMinutes > 0 ? "retard" : "ponctuel";

  const attendanceId = randomUUID();

  await run(
    `
    INSERT INTO attendance (
      _id,
      employeeId,
      date,
      clockIn,
      status,
      lateMinutes,
      synced,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, 0, 0, datetime('now'), datetime('now'))
    `,
    [attendanceId, employeeId, today, clockIn, status, lateMinutes]
  );
  return getAttendanceById(attendanceId);
}

export async function getAttendanceById(
  _id: string
): Promise<Attendance | undefined | null> {
  return get(
    `
    SELECT *
    FROM attendance
    WHERE _id = ?
    `,
    [_id]
  );
}

export async function getAllAttendance() {
  return all(`
    SELECT *
    FROM attendance
    WHERE isDeleted = 0
    ORDER BY date DESC
  `);
}

export async function getAttendanceByEmployee(employeeId: string) {
  return all(
    `
    SELECT *
    FROM attendance
    WHERE employeeId = ?
      AND isDeleted = 0
    ORDER BY date DESC
    `,
    [employeeId]
  );
}

export async function getAttendanceByDate(date: string) {
  return all(
    `
    SELECT
      a._id,
      a.employeeId,
      a.date,
      a.clockIn,
      a.clockOut,
      a.status,
      a.lateMinutes,
      a.lateNotes,
      e.matricule,
      e.firstName,
      e.lastName,
      e.role,
      e.department
    FROM attendance a
    JOIN employees e
      ON a.employeeId = e._id
    WHERE a.date = ?
      AND a.isDeleted = 0
      AND e.isDeleted = 0
    ORDER BY a.clockIn ASC
    `,
    [date]
  );
}

export async function getAttendanceRecord(employeeId: string, date: string) {
  return get(
    `
    SELECT *
    FROM attendance
    WHERE employeeId = ?
      AND date = ?
      AND isDeleted = 0
    `,
    [employeeId, date]
  );
}

export async function updateClockIn(_id: string, clockIn: string) {
  const existing = await getAttendanceById(_id);

  if (!existing) {
    throw new Error("Attendance record not found");
  }

  const clockInDate = new Date(clockIn);
  const scheduledHour = 8;
  const scheduledMinute = 0;
  const expectedMinutes = scheduledHour * 60 + scheduledMinute;
  const actualMinutes = clockInDate.getHours() * 60 + clockInDate.getMinutes();
  const lateMinutes = Math.max(0, actualMinutes - expectedMinutes);
  const status = lateMinutes > 0 ? "retard" : "ponctuel";

  await run(
    `
    UPDATE attendance
    SET
      clockIn=?,
      lateMinutes=?,
      status=?,
      synced=0,
      updatedAt=datetime('now')
    WHERE _id=?
    `,
    [clockIn, lateMinutes, status, _id]
  );

  return getAttendanceById(_id);
}

export async function submitLateNotes(
  _id: string,
  lateNotes: string | undefined
) {
  const existing = await getAttendanceById(_id);

  if (!existing) {
    throw new Error("Attendance record not found");
  }
  await run(
    `
    UPDATE attendance
    SET
      lateNotes=?,
      synced=0,
      updatedAt=datetime('now')
    WHERE _id=?
    `,
    [lateNotes, _id]
  );

  return getAttendanceById(_id);
}

export async function updateClockOut(_id: string, clockOut: string) {
  const existing = await getAttendanceById(_id);

  if (!existing) {
    throw new Error("Attendance record not found");
  }

  await run(
    `
    UPDATE attendance
    SET
      clockOut=?,
      synced=0,
      updatedAt=datetime('now')
    WHERE _id=?
    `,
    [clockOut, _id]
  );

  return getAttendanceById(_id);
}

export async function deleteAttendance(_id: string) {
  await run(
    `
    UPDATE attendance
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

export async function clockOutAttendance(_id: string, clockOut: string) {
  await run(
    `
    UPDATE attendance
    SET
      clockOut = ?,
      synced = 0,
      updatedAt = datetime('now')
    WHERE _id = ?
    `,
    [clockOut, _id]
  );

  return getAttendanceById(_id);
}
