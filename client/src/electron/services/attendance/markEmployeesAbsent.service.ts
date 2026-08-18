import { markEmployeesAbsentOnline } from "./markEmployeesAbsentOnline.service.js";
import { markEmployeesAbsentLocally } from "./markEmployeesAbsentLocal.service.js";
import { NetworkService } from "../sync/network.service.js";
import { completeMarkAbsent } from "../../database/repositories/attendanceDailyCheck.repository.js";

export async function markEmployeesAbsent(date: string) {
  const backendAvailable = await NetworkService.canReachBackend();
  const now = new Date().toISOString();

  if (backendAvailable) {
    try {
      const absentAttendance = await markEmployeesAbsentOnline(date);

      //  Save backend result into  SQLite
      //  await createAbsentAttendance(absentAttendance);
      console.log("ONLINE ABSENT ATTENDANCE", absentAttendance);
      await completeMarkAbsent(now);
      return {
        absentAttendance,
        source: "AUTO_SERVER" as const,
        synced: true,
        completed: true,
        completedAt: now,
      };
    } catch (error) {
      console.warn(
        "Backend unavailable, falling back to local attendance",
        error
      );
    }
  }

  // Offline or backend request failed
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
