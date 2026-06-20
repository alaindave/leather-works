import axios from "axios";
import { app } from "electron";
import {
  getSetting,
  setSetting,
} from "../database/repositories/settings.repository.js";
import { upsertEmployee } from "../database/repositories/employee.repository.js";
import Employee from "../../shared/types/Employee.js";
// import { upsertAttendance } from "../repositories/attendanceRepository";
// import { upsertLeave } from "../repositories/leaveRepository";

const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;

export async function pullLatestChanges() {
  try {
    const lastSync =
      (await getSetting("lastSync")) ?? "1970-01-01T00:00:00.000Z";

    const response = await axios.get(`${API_URL}/sync/pull`, {
      params: {
        since: lastSync,
      },
    });

    const {
      employees,
      // attendances,
      // leaves,
      serverTime,
    } = response.data;

    await syncEmployees(employees);
    // await syncAttendances(attendances);
    // await syncLeaves(leaves);

    await setSetting("lastSync", serverTime);

    console.log("PULL RESULT:", response);
  } catch (error) {
    console.error("Pull sync failed:", error);
  }
}

async function syncEmployees(employees: Employee[]) {
  for (const employee of employees) {
    await upsertEmployee(employee);
  }
}
