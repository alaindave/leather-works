import axios from "axios";
import { app } from "electron";
import {
  getSetting,
  setSetting,
} from "../database/repositories/settings.repository.js";
import { upsertAdminUser } from "../database/repositories/admin_users.repository.js";
import {
  markEmployeeSynced,
  upsertEmployee,
} from "../database/repositories/employee.repository.js";
import {
  markAttendanceSynced,
  upsertAttendance,
} from "../database/repositories/attendance.repository.js";
import {
  markLeaveSynced,
  upsertLeave,
} from "../database/repositories/leave.repository.js";
import Employee from "../../shared/types/Employee.js";
import Attendance from "../../shared/types/Attendance.js";
import Leave from "../../shared/types/Leave.js";
import AdminUser from "../../shared/types/AdminUser.js";
import Task from "../../shared/types/Task.js";
import {
  markTaskSynced,
  upsertTask,
} from "../database/repositories/task.repository.js";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export async function pullLatestChanges() {
  console.log("PULL SERVICE API URL:", API_URL);
  try {
    const lastSync =
      (await getSetting("lastSync")) ?? "1970-01-01T00:00:00.000Z";

    const response = await axios.get(`${API_URL}/sync/pull`, {
      params: {
        since: lastSync,
      },
    });

    const { adminUsers, employees, attendances, leaves, tasks, serverTime } =
      response.data;
    console.log("PULLED ITEMS FROM SERVER");
    console.log("---------------------------");
    console.log("FETCHED EMPLOYEES:", employees);
    console.log("FETCHED ATTENDANCES:", attendances);
    console.log("FETCHED LEAVES:", leaves);
    console.log("FETCHED TASKS:", tasks);
    console.log("FETCHED ADMIN USERS:", adminUsers);

    await syncEmployees(employees);
    await syncAttendances(attendances);
    await syncLeaves(leaves);
    await syncTasks(tasks);
    await syncAdminUsers(adminUsers);
    await setSetting("lastSync", serverTime);

    return response;
  } catch (error) {
    throw error;
  }
}

async function syncEmployees(employees: Employee[]) {
  for (const employee of employees) {
    try {
      await upsertEmployee(employee);
      await markEmployeeSynced(employee._id);
    } catch (error) {
      console.error("Failed to sync pulled employee:", employee._id, error);
    }
  }
}

async function syncAttendances(attendances: Attendance[]) {
  for (const attendance of attendances) {
    try {
      await upsertAttendance(attendance);
      await markAttendanceSynced(attendance._id);
    } catch (error) {
      console.error("Failed to sync pulled attendance:", attendance._id, error);
    }
  }
}

async function syncLeaves(leaves: Leave[]) {
  for (const leave of leaves) {
    try {
      await upsertLeave(leave);
      await markLeaveSynced(leave._id);
    } catch (error) {
      console.error("Failed to sync pulled leave:", leave._id, error);
    }
  }
}

async function syncTasks(tasks: Task[]) {
  for (const task of tasks) {
    try {
      await upsertTask(task);
      await markTaskSynced(task._id);
    } catch (error) {
      console.error("Failed to sync pulled task:", task._id, error);
    }
  }
}

async function syncAdminUsers(adminUsers: AdminUser[]) {
  for (const adminUser of adminUsers) {
    try {
      await upsertAdminUser(adminUser);
    } catch (error) {
      console.error("Failed to sync pulled admin users:", adminUser._id, error);
    }
  }
}
