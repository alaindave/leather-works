import Attendance from "../../../common/types/Attendance.js";
import {
  VerifyAttendanceDailyCheckInput,
  VerifyDailyAttendanceResult,
} from "../../../common/types/AttendanceDailyCheck.js";
import {
  getAttendanceDailyCheckByDate,
  verifyAttendanceDailyCheck,
} from "../../database/repositories/attendanceDailyCheck.repository.js";
import { getAttendanceByDate } from "../../database/repositories/attendances.repository.js";
import { getAllEmployees } from "../../database/repositories/employees.repository.js";

/**\
 * Verifies the attendance for a given date.
 *
 * Verification is only allowed when:
 * 1. The attendance daily check exists.
 * 2. Employees on leave have been processed.
 * 3. Employees who have no attendance have been marked absent.
 * 4. Every active employee has an attendance record.
 
 */
export async function verifyDailyAttendance(
  input: VerifyAttendanceDailyCheckInput
): Promise<VerifyDailyAttendanceResult> {
  console.log("VERIFY INPUT", input);
  /*
   * 1. Get the daily check.
   */
  const check = await getAttendanceDailyCheckByDate(input.date);

  if (!check) {
    throw new Error(
      `CANNOT VERIFY ATTENDANCE FOR ${input.date}. ` +
        `ATTENDANCE DAILY CHECK DOES NOT EXIST.`
    );
  }

  /*
   * 2. Make sure automatic attendance preparation is complete.
   *
   * markEmployeesOnLeave() runs first.
   * markEmployeesAbsent() runs after 09:00.
   */
  if (!check.markLeaveCompleted) {
    throw new Error(
      `CANNOT VERIFY ATTENDANCE FOR ${input.date}. ` +
        `EMPLOYEES ON LEAVE HAVE NOT BEEN PROCESSED.`
    );
  }

  if (!check.markAbsentCompleted) {
    throw new Error(
      `CANNOT VERIFY ATTENDANCE FOR ${input.date}. ` +
        `EMPLOYEES HAVE NOT YET BEEN MARKED ABSENT.`
    );
  }

  /*
   * 3. Prevent verification of locked attendance.
   */
  if (check.status === "LOCKED") {
    throw new Error(`LA PRESENCE DU ${input.date} EST DEJA VERROUILLE.`);
  }

  /*
   * 4. Prevent duplicate verification.
   */
  if (check.status === "VERIFIED") {
    throw new Error(`LA PRESENCE DU ${input.date} A DEJA ETE VERIFIER.`);
  }

  /*
   * 5. Get all active employees.
   */
  const employees = await getAllEmployees();

  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIF" && employee.isDeleted === 0
  );

  /*
   * 6. Get all attendance records for the date.
   */
  const attendances: Attendance[] = await getAttendanceByDate(input.date);

  /*
   * 7. Build a set of employees who have attendance records.
   */
  const attendanceEmployeeIds = new Set(
    attendances
      .filter((attendance) => attendance.isDeleted === 0)
      .map((attendance) => attendance.employeeId)
  );

  console.log(`ATTENDANCE RECORDS FOR ${input.date}`, attendances);

  console.log(
    `SET OF EMPLOYEES WITH ATTENDANCE RECORDS FOR ${input.date}`,
    attendanceEmployeeIds
  );

  /*
   * 8. Find active employees without attendance.
   */
  const missingEmployeeIds = activeEmployees
    .filter((employee) => !attendanceEmployeeIds.has(employee._id))
    .map((employee) => employee._id);

  console.log(
    ` EMPLOYEES WITH MISSING ATTENDANCE RECORDS FOR ${input.date}`,
    missingEmployeeIds
  );

  /*
   * 9. Do not allow verification while attendance
   *    records are missing.
   */
  if (missingEmployeeIds.length > 0) {
    throw new Error(
      `Impossible de vérifier la présence pour la date du ${new Date(
        input.date
      ).toLocaleDateString("fr-FR")}. ` +
        `${missingEmployeeIds.length} employé(s) ` +
        `manquent a l'appel.`
    );
  }

  /*
   * 10. All validation passed.
   *
   * The repository now performs the actual state
   * transition from OPEN → VERIFIED.
   */
  const verified = await verifyAttendanceDailyCheck({
    date: input.date,
    verifiedBy: input.verifiedBy,
  });

  /*
   * 11. Return verification information to the caller.
   */
  return {
    success: true,
    date: input.date,
    checkId: verified._id,
    verifiedBy: input.verifiedBy,
    employeeCount: activeEmployees.length,
    attendanceCount: attendances.filter(
      (attendance) => attendance.isDeleted === 0
    ).length,
    missingEmployeeIds: [],
  };
}
