import { getOngoingLeaves } from "../../database/repositories/leaves.repository.js";
import {
  createAbsenceLeaveAttendance,
  getAttendanceRecord,
} from "../../database/repositories/attendances.repository.js";
import Leave from "../../../common/types/Leave.js";
import { createAttendanceDailyCheck } from "../../database/repositories/attendanceDailyCheck.repository.js";

export async function markEmployeesOnLeave() {
  console.log("markEmployeesOnLeave SERVICE INITIATED... ");
  const leaves: Leave[] = await getOngoingLeaves();
  const now = new Date().toISOString();
  const today = now.split("T")[0];
  console.log("ONGOING LEAVES:", leaves);
  console.log("TODAY:", today);

  for (const leave of leaves) {
    const existingAttendance = await getAttendanceRecord(
      leave.employeeId,
      today
    );

    if (existingAttendance) {
      continue;
    }
    await createAbsenceLeaveAttendance(leave.employeeId, "CONGÉ");
  }

  console.log("markEmployeesOnLeave COMPLETED");

  await createAttendanceDailyCheck({
    markAbsentCompleted: {
      completed: false,
      completedAt: null,
    },
    markLeaveCompleted: {
      completed: true,
      completedAt: now,
    },
  });

  return {
    completed: true,
    completedAt: now,
  };
}
