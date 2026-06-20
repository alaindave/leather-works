import { ipcMain } from "electron";

import {
  createAttendance,
  getAttendanceById,
  getAllAttendance,
  getAttendanceByEmployee,
  getAttendanceByDate,
  deleteAttendance,
  clockOutAttendance,
  getAttendanceRecord,
  updateClockIn,
  updateClockOut,
  submitLateNotes,
} from "../database/repositories/attendance.repository.js";

export function registerAttendanceIPC() {
  console.log("REGISTERING ATTENDANCE IPC");

  ipcMain.handle(
    "attendance:create",
    async (_, employeeId: string, clockIn: string) => {
      return createAttendance(employeeId, clockIn);
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
    "attendance:updateClockIn",
    async (_, _id: string, clockIn: string) => {
      return updateClockIn(_id, clockIn);
    }
  );

  ipcMain.handle(
    "attendance:updateClockOut",
    async (_, _id: string, clockOut: string) => {
      return updateClockOut(_id, clockOut);
    }
  );

  ipcMain.handle(
    "attendance:submitLateNotes",
    async (_, _id: string, lateNotes: string) => {
      return submitLateNotes(_id, lateNotes);
    }
  );

  ipcMain.handle("attendance:delete", async (_, _id: string) => {
    return deleteAttendance(_id);
  });

  ipcMain.handle(
    "attendance:clockOut",
    async (_, _id: string, clockOut: string) => {
      return clockOutAttendance(_id, clockOut);
    }
  );
}
