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

/**
 * Create a normal/manual attendance record.
 */
export async function createAttendance(input: CreateAttendanceDto) {
  let { employeeId, date, clockIn, clockOut, status } = input;

  let lateMinutes = 0;

  const _id = randomUUID();
  const now = new Date().toISOString();
  const serverVersion = 0;

  const locked = await isAttendanceDateLocked(date);

  if (locked) {
    throw new Error(
      `La présence du ${date} est vérouillée et ne peut pas être modifiée`
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
      source,
      lateMinutes,
      serverVersion,
      synced,
      isDeleted,
      createdAt,
      updatedAt
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      _id,
      employeeId,
      date,
      clockIn ?? null,
      clockOut ?? null,
      status ?? null,
      "MANUAL",
      lateMinutes,
      serverVersion,
      0,
      0,
      now,
      now,
    ]
  );

  const savedAttendance: Attendance = {
    _id,
    employeeId,
    date,
    clockIn: clockIn ?? null,
    clockOut: clockOut ?? null,
    status: status ?? null,
    source: "MANUAL",
    lateMinutes,
    serverVersion,
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

/**
 * Create an ABSENT or CONGÉ attendance record.
 */
export async function createAbsenceLeaveAttendance(
  employeeId: string,
  status: "CONGÉ" | "ABSENT",
  date: string = new Date().toISOString().split("T")[0]
) {
  const locked = await isAttendanceDateLocked(date);

  if (locked) {
    throw new Error(`ATTENDANCE FOR ${date} IS LOCKED AND CANNOT BE MODIFIED`);
  }

  const existingAttendance = await getAttendanceRecord(employeeId, date);

  if (existingAttendance) {
    console.log("ATTENDANCE ALREADY EXISTS:", existingAttendance);

    return existingAttendance;
  }

  const employee = await getEmployeeById(employeeId);

  if (!employee) {
    throw new Error("EMPLOYEE NOT FOUND");
  }

  const _id = randomUUID();
  const now = new Date().toISOString();
  const serverVersion = 0;

  await run(
    `
    INSERT INTO attendances (
      _id,
      employeeId,
      date,
      status,
      source,
      serverVersion,
      createdAt,
      updatedAt,
      synced,
      lastSyncedAt,
      isDeleted
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      _id,
      employeeId,
      date,
      status,
      "MANUAL",
      serverVersion,
      now,
      now,
      0,
      null,
      0,
    ]
  );

  const savedAttendance: Attendance = {
    _id,
    employeeId,
    date,
    status,
    source: "MANUAL",
    serverVersion,
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

  const createdAttendance = await getAttendanceById(_id);

  if (!createdAttendance) {
    throw new Error("FAILED TO CREATE ATTENDANCE RECORD");
  }

  return createdAttendance;
}

/**
 * Get employees who don't have any attendance record for a date.
 */
export async function getEmployeesWithoutAttendance(
  date: string
): Promise<Employee[]> {
  return all(
    `
    SELECT
      e._id,
      e.firstName,
      e.lastName,
      e.remainingLeave
    FROM employees e
    LEFT JOIN attendances a
      ON a.employeeId = e._id
      AND a.date = ?
      AND COALESCE(a.isDeleted, 0) = 0
    WHERE COALESCE(e.isDeleted, 0) = 0
      AND e.status = 'ACTIF'
      AND a._id IS NULL
    ORDER BY e.lastName ASC, e.firstName ASC
    `,
    [date]
  );
}

/**
 * Get payroll attendance summary.
 */
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
      AND COALESCE(isDeleted, 0) = 0
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

/**
 * Get active employees who did not clock in.
 */
export async function getEmployeesWhoDidNotClockIn(
  date: string
): Promise<Employee[]> {
  return all(
    `
    SELECT e.*
    FROM employees e
    WHERE e.status = 'ACTIF'
      AND COALESCE(e.isDeleted, 0) = 0

      AND NOT EXISTS (
        SELECT 1
        FROM attendances a
        WHERE a.employeeId = e._id
          AND a.date = ?
          AND COALESCE(a.isDeleted, 0) = 0
          AND a.status IN ('PONCTUEL', 'RETARD')
      )

      AND NOT EXISTS (
        SELECT 1
        FROM leaves l
        WHERE l.employeeId = e._id
          AND COALESCE(l.isDeleted, 0) = 0
          AND l.status = 'APPROUVÉ'
          AND date(?) BETWEEN l.startDate AND l.endDate
      )
    `,
    [date, date]
  );
}

/**
 * Create an absent attendance from an Attendance record.
 */
export async function createAbsentAttendance(
  attendance: Attendance
): Promise<Attendance> {
  const locked = await isAttendanceDateLocked(attendance.date);

  if (locked) {
    throw new Error(
      `ATTENDANCE FOR ${attendance.date} IS LOCKED AND CANNOT BE MODIFIED`
    );
  }

  const existingAttendance = await getAttendanceRecord(
    attendance.employeeId,
    attendance.date
  );

  if (existingAttendance) {
    console.log("ABSENT ATTENDANCE ALREADY EXISTS:", existingAttendance);

    return existingAttendance;
  }

  const serverVersion = attendance.serverVersion ?? 0;

  await run(
    `
    INSERT OR IGNORE INTO attendances (
      _id,
      employeeId,
      date,
      status,
      source,
      serverVersion,
      createdAt,
      updatedAt,
      synced,
      isDeleted,
      lastSyncedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      attendance._id,
      attendance.employeeId,
      attendance.date,
      attendance.status,
      attendance.source ?? "AUTOMATIC",
      serverVersion,
      attendance.createdAt,
      attendance.updatedAt,
      0,
      attendance.isDeleted ?? 0,
      null,
    ]
  );

  const absentAttendance = await getAttendanceRecord(
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
    payload: JSON.stringify({
      ...attendance,
      serverVersion,
    }),
  });

  return absentAttendance;
}

/**
 * Get attendance by ID.
 */
export async function getAttendanceById(
  _id: string
): Promise<Attendance | undefined | null> {
  return get<Attendance>(
    `
    SELECT *
    FROM attendances
    WHERE _id = ?
      AND COALESCE(isDeleted, 0) = 0
    `,
    [_id]
  );
}

/**
 * Get all attendance records.
 */
export async function getAllAttendance(): Promise<Attendance[]> {
  return all<Attendance>(`
    SELECT *
    FROM attendances
    WHERE COALESCE(isDeleted, 0) = 0
    ORDER BY date DESC
  `);
}

/**
 * Get attendance records for an employee.
 */
export async function getAttendanceByEmployee(
  employeeId: string
): Promise<Attendance[]> {
  return all<Attendance>(
    `
    SELECT *
    FROM attendances
    WHERE employeeId = ?
      AND COALESCE(isDeleted, 0) = 0
    ORDER BY date DESC
    `,
    [employeeId]
  );
}

/**
 * Get all attendance records for a date, including employee information.
 */
export async function getAttendanceByDate(date: string): Promise<
  (Attendance & {
    matricule?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    department?: string;
  })[]
> {
  return all(
    `
    SELECT
      a._id,
      a.employeeId,
      a.date,
      a.clockIn,
      a.clockOut,
      a.status,
      a.source,
      a.lateMinutes,
      a.notes,
      a.serverVersion,
      a.isDeleted,
      a.createdAt,
      a.updatedAt,
      e.matricule,
      e.firstName,
      e.lastName,
      e.role,
      e.department
    FROM attendances a
    JOIN employees e
      ON a.employeeId = e._id
    WHERE a.date = ?
      AND COALESCE(a.isDeleted, 0) = 0
      AND COALESCE(e.isDeleted, 0) = 0
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

// Daily attendance report
export async function getDailyAttendanceReport(date: string): Promise<
  (Attendance & {
    matricule?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    department?: string;
  })[]
> {
  return all(
    `
    SELECT
      e._id,
      e.matricule,
      e.firstName,
      e.lastName,
      e.role,
      e.department,

      a._id,
      a.date,
      a.clockIn,
      a.clockOut,
      a.status,
      a.source,
      a.lateMinutes,
      a.notes,
      a.serverVersion,
      a.isDeleted,
      a.createdAt,
      a.updatedAt

    FROM employees e

    LEFT JOIN attendances a
      ON a.employeeId = e._id
      AND a.date = ?
      AND COALESCE(a.isDeleted, 0) = 0

    WHERE COALESCE(e.isDeleted, 0) = 0
      AND e.status = 'ACTIF'

    ORDER BY
      e.lastName ASC,
      e.firstName ASC
    `,
    [date]
  );
}

/**
 * Get one attendance record for an employee on a specific date.
 *
 * COALESCE(isDeleted, 0) is intentional because older records
 * may have NULL in isDeleted from before the column migration.
 */
export async function getAttendanceRecord(
  employeeId: string,
  date: string
): Promise<Attendance | null> {
  const attendance = await get<Attendance>(
    `
    SELECT *
    FROM attendances
    WHERE employeeId = ?
      AND date = ?
      AND COALESCE(isDeleted, 0) = 0
    ORDER BY createdAt ASC
    LIMIT 1
    `,
    [employeeId, date]
  );
  return attendance ?? null;
}

/**
 * Same natural-key lookup used by sync.
 *
 * Unlike getAttendanceById, this searches by employee + date.
 */
export async function getAttendanceByEmployeeAndDate(
  employeeId: string,
  date: string
): Promise<Attendance | null> {
  return (
    (await get<Attendance>(
      `
      SELECT *
      FROM attendances
      WHERE employeeId = ?
        AND date = ?
        AND COALESCE(isDeleted, 0) = 0
      ORDER BY createdAt ASC
      LIMIT 1
      `,
      [employeeId, date]
    )) ?? null
  );
}

/**
 * Update an attendance record.
 */
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
  const values: unknown[] = [];

  let savedUpdates: Partial<Attendance> = {};

  const updatedAt = new Date().toISOString();

  if (updates.clockIn) {
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
      employeeId: existing.employeeId,
      date,
      clockIn: updates.clockIn,
      lateMinutes,
      status,
      createdAt: existing.createdAt,
      updatedAt,
      serverVersion: existing.serverVersion ?? 0,
    };
  }

  if (updates.clockOut !== undefined) {
    fields.push("clockOut = ?");
    values.push(updates.clockOut);

    savedUpdates = {
      ...savedUpdates,
      _id,
      date,
      employeeId: existing.employeeId,
      clockOut: updates.clockOut,
      createdAt: existing.createdAt,
      updatedAt,
      serverVersion: existing.serverVersion ?? 0,
    };
  }

  if (updates.notes !== undefined) {
    fields.push("notes = ?");
    values.push(updates.notes);

    savedUpdates = {
      ...savedUpdates,
      _id,
      date,
      employeeId: existing.employeeId,
      notes: updates.notes,
      createdAt: existing.createdAt,
      updatedAt,
      serverVersion: existing.serverVersion ?? 0,
    };
  }

  if (updates.status === "CONGÉ") {
    fields.push("status = ?");
    values.push(updates.status);

    savedUpdates = {
      ...savedUpdates,
      _id,
      date,
      employeeId: existing.employeeId,
      status: updates.status,
      createdAt: existing.createdAt,
      updatedAt,
      serverVersion: existing.serverVersion ?? 0,
    };
  }

  if (updates.isDeleted !== undefined) {
    fields.push("isDeleted = ?");
    values.push(updates.isDeleted);

    savedUpdates = {
      ...savedUpdates,
      _id,
      date,
      employeeId: existing.employeeId,
      createdAt: existing.createdAt,
      updatedAt,
      isDeleted: updates.isDeleted,
      serverVersion: existing.serverVersion ?? 0,
    };
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push("synced = ?");
  values.push(0);

  fields.push("updatedAt = ?");
  values.push(updatedAt);

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

/**
 * Soft delete an attendance record.
 */
export async function deleteAttendance(_id: string) {
  const existing = await getAttendanceById(_id);

  if (!existing) {
    throw new Error("ATTENDANCE RECORD NOT FOUND");
  }

  const date = existing.date;

  const locked = await isAttendanceDateLocked(date);

  if (locked) {
    throw new Error(`ATTENDANCE FOR ${date} IS LOCKED AND CANNOT BE MODIFIED`);
  }

  const now = new Date().toISOString();

  await run(
    `
    UPDATE attendances
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
    `,
    [now, _id]
  );

  const deletePayload: Partial<Attendance> = {
    _id,
    employeeId: existing.employeeId,
    date: existing.date,
    isDeleted: 1,
    serverVersion: existing.serverVersion ?? 0,
    createdAt: existing.createdAt,
    updatedAt: now,
  };

  console.log("ATTENDANCE TO DELETE FROM SYNC QUEUE", deletePayload);

  await addToSyncQueue({
    entity: "attendance",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify(deletePayload),
  });

  return getAttendanceById(_id);
}

export async function upsertAttendance(attendance: Attendance) {
  /*
   * ============================================================
   * 1. FIND EXISTING RECORD
   * ============================================================
   *
   * IMPORTANT:
   *
   * Sync must search deleted records too.
   *
   * A soft-deleted SQLite row still occupies its _id, even though
   * normal application queries hide it.
   */
  let local = await getAttendanceByIdIncludingDeleted(attendance._id);

  /*
   * If the exact _id does not exist, look for an existing
   * attendance for the same employee/date.
   *
   * This query also includes deleted records.
   */
  if (!local) {
    local = await getAttendanceByEmployeeAndDateIncludingDeleted(
      attendance.employeeId,
      attendance.date
    );
  }

  /*
   * ============================================================
   * 2. EXISTING LOCAL RECORD
   * ============================================================
   */
  if (local) {
    const localVersion = Number(local.serverVersion ?? 0);
    const remoteVersion = Number(attendance.serverVersion ?? 0);

    console.log("ATTENDANCE UPSERT CONFLICT CHECK:", {
      localId: local._id,
      remoteId: attendance._id,
      employeeId: attendance.employeeId,
      date: attendance.date,
      localVersion,
      remoteVersion,
      localIsDeleted: local.isDeleted,
      remoteIsDeleted: attendance.isDeleted,
    });

    /*
     * Never overwrite a newer local version.
     */
    if (remoteVersion < localVersion) {
      console.log(
        `SKIPPING ATTENDANCE ${attendance._id}: ` +
          `LOCAL VERSION ${localVersion} > REMOTE VERSION ${remoteVersion}`
      );

      return local;
    }

    /*
     * IMPORTANT:
     *
     * Never change local._id to attendance._id here.
     *
     * If the local record was found by employeeId + date,
     * preserve its existing SQLite identity.
     */
    await run(
      `
      UPDATE attendances
      SET
        employeeId = ?,
        date = ?,
        clockIn = ?,
        clockOut = ?,
        status = ?,
        source = ?,
        lateMinutes = ?,
        notes = ?,
        serverVersion = ?,
        isDeleted = ?,
        createdAt = ?,
        updatedAt = ?,
        synced = 1,
        lastSyncedAt = CURRENT_TIMESTAMP
      WHERE _id = ?
      `,
      [
        attendance.employeeId,
        attendance.date,
        attendance.clockIn ?? null,
        attendance.clockOut ?? null,
        attendance.status ?? null,
        attendance.source ?? null,
        attendance.lateMinutes ?? 0,
        attendance.notes ?? null,
        remoteVersion,
        attendance.isDeleted ?? 0,
        attendance.createdAt,
        attendance.updatedAt,

        /*
         * Preserve the local SQLite _id.
         */
        local._id,
      ]
    );

    /*
     * IMPORTANT:
     *
     * Since this record may now be isDeleted = 1, DO NOT use
     * getAttendanceById() here if that function hides deleted rows.
     */
    const result = await getAttendanceByIdIncludingDeleted(local._id);

    if (!result) {
      throw new Error(`ATTENDANCE ${local._id} DISAPPEARED AFTER UPDATE`);
    }

    console.log("ATTENDANCE UPDATED FROM SERVER:", {
      localId: local._id,
      remoteId: attendance._id,
      employeeId: attendance.employeeId,
      date: attendance.date,
      serverVersion: remoteVersion,
      isDeleted: attendance.isDeleted ?? 0,
    });

    return result;
  }

  /*
   * ============================================================
   * 3. NO LOCAL RECORD
   * ============================================================
   */

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
      serverVersion,
      isDeleted,
      createdAt,
      updatedAt,
      synced,
      lastSyncedAt
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, 1, CURRENT_TIMESTAMP
    )
    `,
    [
      attendance._id,
      attendance.employeeId,
      attendance.date,
      attendance.clockIn ?? null,
      attendance.clockOut ?? null,
      attendance.status ?? null,
      attendance.source ?? null,
      attendance.lateMinutes ?? 0,
      attendance.notes ?? null,
      Number(attendance.serverVersion ?? 0),
      attendance.isDeleted ?? 0,
      attendance.createdAt,
      attendance.updatedAt,
    ]
  );

  /*
   * The inserted record may itself be a tombstone
   * (isDeleted = 1), so query without the deletion filter.
   */
  const result = await getAttendanceByIdIncludingDeleted(attendance._id);

  if (!result) {
    throw new Error(`ATTENDANCE ${attendance._id} DISAPPEARED AFTER INSERT`);
  }

  console.log("ATTENDANCE INSERTED FROM SERVER:", {
    id: result._id,
    employeeId: result.employeeId,
    date: result.date,
    serverVersion: result.serverVersion,
    isDeleted: result.isDeleted,
  });

  return result;
}

// Mark attendance as synced.
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

async function getAttendanceByIdIncludingDeleted(
  _id: string
): Promise<Attendance | null> {
  return get<Attendance>(
    `
    SELECT *
    FROM attendances
    WHERE _id = ?
    LIMIT 1
    `,
    [_id]
  );
}

async function getAttendanceByEmployeeAndDateIncludingDeleted(
  employeeId: string,
  date: string
): Promise<Attendance | null> {
  return get<Attendance>(
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
