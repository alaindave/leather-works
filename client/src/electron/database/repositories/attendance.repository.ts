import type Attendance from "../../../shared/types/Attendance.js";
import { randomUUID } from "crypto";
import { all, get, run } from "../db.js";
import { getEmployeeById } from "./employee.repository.js";
import { addToSyncQueue } from "./sync.repository.js";

export async function createAttendance(employeeId: string, clockIn: string) {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new Error("No employee found with the given ID");
  }
  const now = new Date();
  const createdAt = now.toISOString();
  const date = now.toISOString().split("T")[0];
  const existingAttendance = await getAttendanceRecord(employeeId, date);

  console.log("Existing attendance:", existingAttendance);
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

  const _id = randomUUID();

  await run(
    `
    INSERT INTO attendances (
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
    [_id, employeeId, date, clockIn, status, lateMinutes]
  );

  const savedAttendance = {
    _id,
    employeeId,
    date,
    clockIn,
    status,
    lateMinutes,
    createdAt,
  };

  console.log("Attendance to save to sync queue", savedAttendance);

  await addToSyncQueue({
    entity: "attendance",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedAttendance),
  });

  return getAttendanceById(_id);
}

export async function getAttendanceById(
  _id: string
): Promise<Attendance | undefined | null> {
  return get(
    `
    SELECT *
    FROM attendances
    WHERE _id = ?
    `,
    [_id]
  );
}

export async function getAllAttendance() {
  return all(`
    SELECT *
    FROM attendances
    WHERE isDeleted = 0
    ORDER BY date DESC
  `);
}

export async function getAttendanceByEmployee(employeeId: string) {
  return all(
    `
    SELECT *
    FROM attendances
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
    FROM attendances a
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
    FROM attendances
    WHERE employeeId = ?
      AND date = ?
      AND isDeleted = 0
    `,
    [employeeId, date]
  );
}

// export async function updateClockIn(_id: string, clockIn: string) {
//   const existing = await getAttendanceById(_id);

//   if (!existing) {
//     throw new Error("Attendance record not found");
//   }

//   const clockInDate = new Date(clockIn);
//   const scheduledHour = 8;
//   const scheduledMinute = 0;
//   const expectedMinutes = scheduledHour * 60 + scheduledMinute;
//   const actualMinutes = clockInDate.getHours() * 60 + clockInDate.getMinutes();
//   const lateMinutes = Math.max(0, actualMinutes - expectedMinutes);
//   const status = lateMinutes > 0 ? "retard" : "ponctuel";

//   await run(
//     `
//     UPDATE attendances
//     SET
//       clockIn=?,
//       lateMinutes=?,
//       status=?,
//       synced=0,
//       updatedAt=datetime('now')
//     WHERE _id=?
//     `,
//     [clockIn, lateMinutes, status, _id]
//   );

//   return getAttendanceById(_id);
// }

export async function updateAttendance(
  _id: string,
  updates: Partial<
    Pick<Attendance, "clockIn" | "clockOut" | "lateNotes" | "isDeleted">
  >
) {
  const existing = await getAttendanceById(_id);

  if (!existing) {
    throw new Error("Attendance record not found");
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (updates.clockIn !== undefined) {
    const clockInDate = new Date(updates.clockIn);

    const scheduledHour = 8;
    const scheduledMinute = 0;

    const expectedMinutes = scheduledHour * 60 + scheduledMinute;
    const actualMinutes =
      clockInDate.getHours() * 60 + clockInDate.getMinutes();

    const lateMinutes = Math.max(0, actualMinutes - expectedMinutes);
    const status = lateMinutes > 0 ? "retard" : "ponctuel";

    fields.push("clockIn = ?");
    values.push(updates.clockIn);

    fields.push("lateMinutes = ?");
    values.push(lateMinutes);

    fields.push("status = ?");
    values.push(status);
  }

  if (updates.clockOut !== undefined) {
    fields.push("clockOut = ?");
    values.push(updates.clockOut);
  }

  if (updates.lateNotes !== undefined) {
    fields.push("lateNotes = ?");
    values.push(updates.lateNotes);
  }

  if (updates.isDeleted !== undefined) {
    fields.push("isDeleted = ?");
    values.push(updates.isDeleted);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push("synced = 0");
  fields.push("updatedAt = datetime('now')");

  values.push(_id);

  await run(
    `
    UPDATE attendances
    SET ${fields.join(", ")}
    WHERE _id = ?
    `,
    values
  );

  return getAttendanceById(_id);
}

export async function deleteAttendance(_id: string) {
  await run(
    `
    UPDATE attendances
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

export async function upsertAttendance(attendance: Attendance) {
  const local = await getAttendanceById(attendance._id);
  // If local exists, apply conflict rule
  if (local && local.updatedAt) {
    const localTime = new Date(local.updatedAt).getTime();
    const remoteTime = new Date(attendance.updatedAt!).getTime();

    //  Keep newest local change
    if (remoteTime < localTime) {
      console.log(`Skipping remote update (local is newer): ${attendance._id}`);
      return local;
    }
  }

  await run(
    `
    INSERT INTO attendances (
      _id,
      employeeId,
      date,
      clockIn,
      clockOut,
      status,
      lateMinutes,
      lateNotes,
      synced,
      isDeleted,
      createdAt,
      updatedAt,
      lastSyncedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?,?)
    ON CONFLICT(_id)
    DO UPDATE SET
      employeeId = excluded.employeeId,
      date = excluded.date,
      clockIn = excluded.clockIn,
      clockOut = excluded.clockOut,
      status = excluded.status,
      lateMinutes = excluded.lateMinutes,
      lateNotes = excluded.lateNotes,
      isDeleted = excluded.isDeleted,
      synced = 1,
      updatedAt = excluded.updatedAt
      lastSyncedAt = excluded.lastSyncedAt
    `,
    [
      attendance._id,
      attendance.employeeId,
      attendance.date,
      attendance.clockIn,
      attendance.clockOut,
      attendance.status,
      attendance.lateMinutes,
      attendance.lateNotes,
      attendance.isDeleted ?? 0,
      attendance.createdAt ?? new Date().toISOString(),
      attendance.updatedAt ?? new Date().toISOString(),
      new Date().toISOString(),
    ]
  );

  return getAttendanceById(attendance._id);
}

export async function markAttendanceSynced(_id: string) {
  await run(
    `
    UPDATE attendances
    SET synced = 1
    WHERE _id = ?
    `,
    [_id]
  );
}
