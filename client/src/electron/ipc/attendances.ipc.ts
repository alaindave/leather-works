import { ipcMain } from "electron";

import {
  createAttendance,
  getAttendanceById,
  getAllAttendance,
  getAttendanceByEmployee,
  getAttendanceByDate,
  updateAttendance,
  deleteAttendance,
  getAttendanceRecord,
  createAbsenceLeaveAttendance,
} from "../database/repositories/attendances.repository.js";
import AttendanceWithEmployee from "../../common/types/AttendanceWithEmployee.js";
import { markEmployeesAbsent } from "../services/attendance/markEmployeesAbsent.service.js";

export function registerAttendanceIPC() {
  console.log("REGISTERING ATTENDANCES IPC");

  ipcMain.handle(
    "attendance:create",
    async (_, employeeId: string, clockIn: string) => {
      return createAttendance(employeeId, clockIn);
    }
  );

  ipcMain.handle(
    "attendance:createAbsenceLeave",
    async (_, employeeId: string, status: "CONGÉ" | "ABSENT") => {
      return createAbsenceLeaveAttendance(employeeId, status);
    }
  );

  ipcMain.handle("attendance:getAll", async () => {
    return getAllAttendance();
  });

  ipcMain.handle("attendance:getById", async (_, _id: string) => {
    return getAttendanceById(_id);
  });

  ipcMain.handle("attendance:getByEmployee", async (_, employeeId: string) => {
    return getAttendanceByEmployee(employeeId);
  });

  ipcMain.handle("attendance:getByDate", async (_, date: string) => {
    return getAttendanceByDate(date);
  });

  ipcMain.handle(
    "attendance:getAttendanceRecord",
    async (_, employeeId: string, date: string) => {
      return getAttendanceRecord(employeeId, date);
    }
  );

  ipcMain.handle(
    "attendance:update",
    async (_, _id: string, updates: Partial<AttendanceWithEmployee>) => {
      return updateAttendance(_id, updates);
    }
  );

  ipcMain.handle("attendance:mark-absent", async (_, date: string) => {
    return markEmployeesAbsent(date);
  });

  ipcMain.handle("attendance:delete", async (_, _id: string) => {
    return deleteAttendance(_id);
  });
}
