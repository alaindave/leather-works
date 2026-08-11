import { getOngoingLeaves } from "../../database/repositories/leaves.repository.js";
import {
  createLeaveAttendance,
  getAttendanceRecord,
} from "../../database/repositories/attendances.repository.js";
import Leave from "../../../common/types/Leave.js";

export async function markEmployeesOnLeave() {
  console.log("markEmployeesOnLeave SERVICE INITIATED... ");
  const leaves: Leave[] = await getOngoingLeaves();
  const today = new Date().toISOString().split("T")[0];
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
    await createLeaveAttendance(leave.employeeId);
  }
}
