import { markEmployeesAbsentOnline } from "./markEmployeesAbsentOnline.service.js";
import { markEmployeesAbsentLocally } from "./markEmployeesAbsentLocal.service.js";
import { NetworkService } from "../sync/network.service.js";

export async function markEmployeesAbsent() {
  const backendAvailable = await NetworkService.canReachBackend();

  if (backendAvailable) {
    try {
      const absentAttendance = await markEmployeesAbsentOnline();

      //  Save backend result into  SQLite
      //  await createAbsentAttendance(absentAttendance);
      console.log("ONLINE ABSENT ATTENDANCE", absentAttendance);
      return {
        absentAttendance,
        source: "AUTO_SERVER" as const,
        synced: true,
      };
    } catch (error) {
      console.warn(
        "Backend unavailable, falling back to local attendance",
        error
      );
    }
  }

  // Offline or backend request failed
  const absentAttendance = await markEmployeesAbsentLocally();
  console.log("OFFLINE ABSENT ATTENDANCE", absentAttendance);

  return {
    absentAttendance,
    source: "LOCAL" as const,
    synced: false,
  };
}
