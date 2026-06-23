import axios from "axios";
import { app } from "electron";
import {
  getSetting,
  setSetting,
} from "../database/repositories/settings.repository.js";
import { upsertTaskRecipient } from "../database/repositories/taskRecipients.repository.js";
import { upsertEmployee } from "../database/repositories/employee.repository.js";
import { upsertAttendance } from "../database/repositories/attendance.repository.js";
import { upsertLeave } from "../database/repositories/leave.repository.js";
import Employee from "../../shared/types/Employee.js";
import Attendance from "../../shared/types/Attendance.js";
import Leave from "../../shared/types/Leave.js";
import TaskRecipient from "../../shared/types/TaskRecipient.js";

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

    const { employees, attendances, leaves, taskRecipients, serverTime } =
      response.data;

    console.log("Fetched employees to sync:", employees);

    await syncEmployees(employees);
    await syncAttendances(attendances);
    await syncLeaves(leaves);
    await syncTaskRecipients(taskRecipients);
    await setSetting("lastSync", serverTime);
    return response;
  } catch (error) {
    throw error;
  }
}

async function syncEmployees(employees: Employee[]) {
  for (const employee of employees) {
    await upsertEmployee(employee);
  }
}

async function syncAttendances(attendances: Attendance[]) {
  for (const attendance of attendances) {
    await upsertAttendance(attendance);
  }
}

async function syncLeaves(leaves: Leave[]) {
  for (const leave of leaves) {
    await upsertLeave(leave);
  }
}

async function syncTaskRecipients(taskRecipients: TaskRecipient[]) {
  for (const taskRecipient of taskRecipients) {
    await upsertTaskRecipient(taskRecipient);
  }
}
