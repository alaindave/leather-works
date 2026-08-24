import type Attendance from "../../../common/types/Attendance.js";
import { randomUUID } from "crypto";
import { all, get, run } from "../db.js";
import { getEmployeeById } from "./employees.repository.js";
import { addToSyncQueue } from "./sync.repository.js";
import Employee from "../../../common/types/Employee.js";
import {
  CreateAttendanceDto,
  PayrollAttendanceSummary,
} from "../../../common/types/Attendance.js";
import { isAttendanceDateLocked } from "./attendanceDailyCheck.repository.js";
import AttendanceWithEmployee from "../../../common/types/AttendanceWithEmployee.js";

export async function createAttendance(input: CreateAttendanceDto) {
  let { employeeId, date, clockIn, clockOut, status } = input;
  let lateMinutes = 0;
  const _id = randomUUID();
  const now = new Date().toISOString();
  const locked = await isAttendanceDateLocked(date);
  if (locked) {
    throw new Error(
      `La présence du ${date} est vérouillé et ne peut pas être modifié`
    );
  }
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new Error("Il n'y a pas d'employé avec cet identifiant");
  }
  const existingAttendance = await getAttendanceRecord(employeeId, date);
  console.log("EXISTING ATTENDANCE:", existingAttendance);

  if (existingAttendance) {
    throw new Error("L'employé a déja pointé");
  }

  if (clockIn) {
    const clockInDate = new Date(clockIn);
    const scheduledHour = 8;
    const scheduledMinute = 0;
    const expectedMinutes = scheduledHour * 60 + scheduledMinute;
    const actualMinutes =
      clockInDate.getHours() * 60 + clockInDate.getMinutes();
    lateMinutes = Math.max(0, actualMinutes - expectedMinutes);
    status = lateMinutes > 0 ? "RETARD" : "PONCTUEL";
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
      synced,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?,?, ?, 0, 0, datetime('now'), datetime('now'))
    `,
    [_id, input.employeeId, date, clockIn, clockOut, status, lateMinutes]
  );

  const savedAttendance = {
    _id,
    employeeId,
    date,
    clockIn,
    clockOut: clockOut ?? null,
    status,
    lateMinutes,
    createdAt: now,
    updatedAt: now,
  };

  console.log("ATTENDANCE TO SAVE TO SYNC QUEUE", savedAttendance);

  await addToSyncQueue({
    entity: "attendance",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedAttendance),
  });

  return getAttendanceById(_id);
}

export async function createAbsenceLeaveAttendance(
  employeeId: string,
  status: "CONGÉ" | "ABSENT",
  date: string = new Date().toISOString().split("T")[0]
) {
  const locked = await isAttendanceDateLocked(date);
  if (locked) {
    throw new Error(`ATTENDANCE FOR ${date} IS LOCKED AND CANNOT BE MODIFIED`);
  }
  const _id = randomUUID();
  const now = new Date().toISOString();

  await run(
    `
      INSERT INTO attendances (
        _id,
        employeeId,
        date,
        status,
        createdAt,
        updatedAt,
        synced,
        lastSyncedAt
      )
      VALUES (?,?, ?, ?, ?, ?, ?, ?)
    `,
    [_id, employeeId, date, status, now, now, 0, now]
  );
  const savedAttendance = {
    _id,
    employeeId,
    date,
    status,
    createdAt: now,
    updatedAt: now,
  };

  console.log("ATTENDANCE TO SAVE TO SYNC QUEUE", savedAttendance);

  await addToSyncQueue({
    entity: "attendance",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedAttendance),
  });

  return getAttendanceById(_id);
}

export async function getEmployeesWithoutAttendance(
  date: string
): Promise<Employee[]> {
  return all(
    `
    SELECT
      e._id,
      e.firstName,
      e.lastName
    FROM employees e
    LEFT JOIN attendances a
      ON a.employeeId = e._id
      AND a.date = ?
      AND a.isDeleted = 0
    WHERE e.isDeleted = 0
      AND e.status = 'ACTIF'
      AND a._id IS NULL
    ORDER BY e.lastName ASC, e.firstName ASC
    `,
    [date]
  );
}

export async function getPayrollAttendanceSummary(
  employeeId: string,
  month: number,
  year: number
): Promise<PayrollAttendanceSummary> {
  const result = await get<{
    lateDays: number;
    totalLateMinutes: number;
    absentDays: number;
  }>(
    `
    SELECT
      COUNT(
        CASE
          WHEN status = 'RETARD' THEN 1
        END
      ) AS lateDays,

      COALESCE(
        SUM(
          CASE
            WHEN status = 'RETARD'
            THEN lateMinutes
            ELSE 0
          END
        ),
        0
      ) AS totalLateMinutes,

      COUNT(
        CASE
          WHEN status = 'ABSENT' THEN 1
        END
      ) AS absentDays

    FROM attendances

    WHERE employeeId = ?
      AND date >= ?
      AND date < ?
      AND isDeleted = 0
    `,
    [
      employeeId,
      `${year}-${String(month).padStart(2, "0")}-01`,
      getNextMonthDate(year, month),
    ]
  );

  return {
    employeeId,
    lateDays: result?.lateDays ?? 0,
    totalLateMinutes: result?.totalLateMinutes ?? 0,
    absentDays: result?.absentDays ?? 0,
  };
}

function getNextMonthDate(year: number, month: number): string {
  const nextMonth = new Date(year, month, 1);

  return nextMonth.toISOString().split("T")[0];
}

export async function getEmployeesWhoDidNotClockIn(
  date: string
): Promise<Employee[]> {
  return all(
    `
      SELECT e.*
      FROM employees e
      WHERE e.status = 'ACTIF'

      AND NOT EXISTS (
        SELECT 1
        FROM attendances a
        WHERE a.employeeId = e._id
          AND a.date = ?
          AND a.isDeleted = 0
          AND a.status IN ('PONCTUEL', 'RETARD')
      )

      AND NOT EXISTS (
        SELECT 1
        FROM leaves l
        WHERE l.employeeId = e._id
          AND l.isDeleted = 0
          AND l.status = 'APPROUVÉ'
          AND date(?) BETWEEN l.startDate AND l.endDate
      )
    `,
    [date, date]
  );
}

export async function createAbsentAttendance(
  attendance: Attendance
): Promise<Attendance> {
  const locked = await isAttendanceDateLocked(attendance.date);
  if (locked) {
    throw new Error(
      `ATTENDANCE FOR ${attendance.date} IS LOCKED AND CANNOT BE MODIFIED`
    );
  }
  await run(
    `
      INSERT OR IGNORE INTO attendances (
        _id,
        employeeId,
        date,
        status,
        source,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      attendance._id,
      attendance.employeeId,
      attendance.date,
      attendance.status,
      attendance.source,
      attendance.createdAt,
      attendance.updatedAt,
    ]
  );

  const absentAttendance: Attendance | null = await getAttendanceRecord(
    attendance.employeeId,
    attendance.date
  );

  if (!absentAttendance) {
    throw new Error("FAILED TO CREATE ATTENDANCE RECORD");
  }

  await addToSyncQueue({
    entity: "attendance",
    entityId: attendance._id,
    operation: "create",
    payload: JSON.stringify(attendance),
  });

  return absentAttendance;
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

export async function getAttendanceByDate(date: string): Promise<Attendance[]> {
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
      a.notes,
      a.isDeleted,
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
    ORDER BY
      a.clockIn IS NULL ASC,
      CASE
        WHEN a.clockIn IS NOT NULL THEN a.clockIn
        ELSE a.createdAt
      END ASC
    `,
    [date]
  );
}

export async function getAttendanceRecord(
  employeeId: string,
  date: string
): Promise<Attendance | null> {
  return get(
    `
    SELECT *
    FROM attendances
    WHERE employeeId = ?
      AND date = ?
      AND isDeleted = 0
    ORDER BY createdAt ASC

    `,
    [employeeId, date]
  );
}

export async function updateAttendance(
  _id: string,
  date: string,
  updates: Partial<AttendanceWithEmployee>
) {
  const locked = await isAttendanceDateLocked(date);
  if (locked) {
    throw new Error(`ATTENDANCE FOR ${date} IS LOCKED AND CANNOT BE MODIFIED`);
  }
  const existing = await getAttendanceById(_id);
  console.log("EXISTING ATTENDANCE TO UPDATE", existing);
  console.log("UPDATES", updates);

  if (!existing) {
    throw new Error("ATTENDANCE RECORD NOT FOUND");
  }

  const fields: string[] = [];
  const values: any[] = [];
  let savedUpdates = {};
  const updatedAt = new Date().toISOString();

  if (updates.clockIn !== undefined) {
    const clockInDate = new Date(updates.clockIn);

    const scheduledHour = 8;
    const scheduledMinute = 0;

    const expectedMinutes = scheduledHour * 60 + scheduledMinute;
    const actualMinutes =
      clockInDate.getHours() * 60 + clockInDate.getMinutes();

    const lateMinutes = Math.max(0, actualMinutes - expectedMinutes);
    const status = lateMinutes > 0 ? "RETARD" : "PONCTUEL";

    fields.push("clockIn = ?");
    values.push(updates.clockIn);

    fields.push("lateMinutes = ?");
    values.push(lateMinutes);

    fields.push("status = ?");
    values.push(status);

    savedUpdates = {
      ...savedUpdates,
      _id,
      employeedId: existing.employeeId,
      clockIn: updates.clockIn,
      lateMinutes,
      status,
      createdAt: existing.createdAt,
      updatedAt,
    };
  }

  if (updates.clockOut !== undefined) {
    fields.push("clockOut = ?");
    values.push(updates.clockOut);
    savedUpdates = {
      ...savedUpdates,
      _id,
      employeedId: existing.employeeId,
      clockOut: updates.clockOut,
      createdAt: existing.createdAt,
      updatedAt,
    };
  }

  if (updates.notes !== undefined) {
    fields.push("notes = ?");
    values.push(updates.notes);
    savedUpdates = {
      ...savedUpdates,
      _id,
      employeedId: existing.employeeId,
      notes: updates.notes,
      createdAt: existing.createdAt,
      updatedAt,
    };
  }

  if (updates.status === "CONGÉ") {
    fields.push("status = ?");
    values.push(updates.status);
    savedUpdates = {
      ...savedUpdates,
      status: updates.status,
    };
  }

  if (updates.isDeleted !== undefined) {
    fields.push("isDeleted = ?");
    values.push(updates.isDeleted);
    savedUpdates = {
      ...savedUpdates,
      _id,
      createdAt: existing.createdAt,
      updatedAt,
      employeedId: existing.employeeId,
      isDeleted: updates.isDeleted,
    };
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

  console.log("ATTENDANCE TO SAVE TO SYNC QUEUE", savedUpdates);

  await addToSyncQueue({
    entity: "attendance",
    entityId: _id,
    operation: "update",
    payload: JSON.stringify(savedUpdates),
  });

  return getAttendanceById(_id);
}

export async function deleteAttendance(_id: string) {
  const now = new Date().toISOString();
  const date = now.split("T")[0];
  const locked = await isAttendanceDateLocked(date);
  if (locked) {
    throw new Error(`ATTENDANCE FOR ${date} IS LOCKED AND CANNOT BE MODIFIED`);
  }
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

  const updatedAt = new Date().toISOString();

  console.log("Attendance to delete from sync queue", { _id, updatedAt });

  await addToSyncQueue({
    entity: "attendance",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({ _id, updatedAt }),
  });

  return getAttendanceById(_id);
}

export async function upsertAttendance(attendance: Attendance) {
  // 1. Try to find the record by remote/local ID
  let local = await getAttendanceById(attendance._id);

  // 2. If it doesn't exist, try the natural unique key
  //    employeeId + date
  if (!local) {
    local = await getAttendanceByEmployeeAndDate(
      attendance.employeeId,
      attendance.date
    );
  }

  // 3. Conflict resolution
  if (local && local.updatedAt && attendance.updatedAt) {
    const localTime = new Date(local.updatedAt).getTime();
    const remoteTime = new Date(attendance.updatedAt).getTime();

    // Local version is newer
    if (remoteTime < localTime) {
      console.log(
        `SKIPPING REMOTE ATTENDANCE. LOCAL IS NEWER: ${attendance._id}`
      );

      return local;
    }
  }

  // 4. If a local record exists with a different _id,
  //    update that existing record instead of inserting.
  if (local) {
    await run(
      `
      UPDATE attendances
      SET
        _id = ?,
        employeeId = ?,
        date = ?,
        clockIn = ?,
        clockOut = ?,
        status = ?,
        source = ?,
        lateMinutes = ?,
        notes = ?,
        isDeleted = ?,
        createdAt = ?,
        updatedAt = ?
      WHERE _id = ?
      `,
      [
        attendance._id,
        attendance.employeeId,
        attendance.date,
        attendance.clockIn,
        attendance.clockOut,
        attendance.status,
        attendance.source,
        attendance.lateMinutes,
        attendance.notes,
        attendance.isDeleted ?? 0,
        attendance.createdAt,
        attendance.updatedAt,
        local._id,
      ]
    );

    return getAttendanceById(attendance._id);
  }

  // 5. No local record exists at all, so insert it.
  await run(
    `
    INSERT INTO attendances (
      _id,
      employeeId,
      date,
      clockIn,
      clockOut,
      status,
      source,
      lateMinutes,
      notes,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      attendance._id,
      attendance.employeeId,
      attendance.date,
      attendance.clockIn,
      attendance.clockOut,
      attendance.status,
      attendance.source,
      attendance.lateMinutes,
      attendance.notes,
      attendance.isDeleted ?? 0,
      attendance.createdAt,
      attendance.updatedAt,
    ]
  );

  return getAttendanceById(attendance._id);
}

export async function getAttendanceByEmployeeAndDate(
  employeeId: string,
  date: string
): Promise<Attendance | null> {
  return get(
    `
    SELECT *
    FROM attendances
    WHERE employeeId = ?
      AND date = ?
    LIMIT 1
    `,
    [employeeId, date]
  );
}

export async function markAttendanceSynced(_id: string) {
  await run(
    `
    UPDATE attendances
    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );
}
