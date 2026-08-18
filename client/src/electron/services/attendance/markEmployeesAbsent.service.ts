import { markEmployeesAbsentOnline } from "./markEmployeesAbsentOnline.service.js";
import { markEmployeesAbsentLocally } from "./markEmployeesAbsentLocal.service.js";
import { markEmployeesOnLeave } from "./markEmployeesOnLeave.service.js";
import { NetworkService } from "../sync/network.service.js";
import {
  completeMarkAbsent,
  getAttendanceDailyCheckByDate,
} from "../../database/repositories/attendanceDailyCheck.repository.js";

export async function markEmployeesAbsent(date: string) {
  const now = new Date().toISOString();

  /*
   * ---------------------------------------------------------
   * 1. Make sure employees on leave have been processed first
   * ---------------------------------------------------------
   */

  let dailyCheck = await getAttendanceDailyCheckByDate(date);

  if (!dailyCheck?.markLeaveCompleted) {
    console.log(
      `MARK EMPLOYEES ON LEAVE HAS NOT RUN FOR ${date}. RUNNING IT NOW...`
    );

    try {
      await markEmployeesOnLeave(date);
      console.log(`MARK EMPLOYEES ON LEAVE COMPLETED FOR ${date}`);
    } catch (error) {
      console.error(`FAILED TO MARK EMPLOYEES ON LEAVE FOR ${date}`, error);
      throw error;
    }
  } else {
    console.log(`MARK EMPLOYEES ON LEAVE ALREADY COMPLETED FOR ${date}`);
  }

  /*
   * ---------------------------------------------------------
   * 2. Mark remaining employees as absent
   * ---------------------------------------------------------
   */

  const backendAvailable = await NetworkService.canReachBackend();

  if (backendAvailable) {
    try {
      const absentAttendance = await markEmployeesAbsentOnline(date);

      console.log("ONLINE ABSENT ATTENDANCE", absentAttendance);

      await completeMarkAbsent(now, date);

      return {
        absentAttendance,
        source: "AUTO_SERVER" as const,
        synced: true,
        completed: true,
        completedAt: now,
      };
    } catch (error) {
      console.warn(
        "BACKEND REQUEST FAILED, FALLING BACK TO LOCAL ATTENDANCE",
        error
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * 3. Offline/local fallback
   * ---------------------------------------------------------
   */

  const absentAttendance = await markEmployeesAbsentLocally(date);

  console.log("OFFLINE ABSENT ATTENDANCE", absentAttendance);

  await completeMarkAbsent(now);

  return {
    absentAttendance,
    source: "LOCAL" as const,
    synced: false,
    completed: true,
    completedAt: now,
  };
}
