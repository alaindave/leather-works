import { ipcMain } from "electron";

import {
  createLeave,
  getLeaveById,
  getLeaveByMonth,
  updateLeave,
  deleteLeave,
} from "../database/repositories/leave.repository.cjs";

export function registerLeaveIPC() {
  console.log("REGISTERING LEAVE IPC");

  ipcMain.handle(
    "leave:create",
    async (
      _,
      employeeId: string,
      startDate: string,
      endDate: string,
      subject: string,
      notes: string
    ) => {
      return createLeave(employeeId, startDate, endDate, subject, notes);
    }
  );

  ipcMain.handle("leave:getLeaveById", async (_, _id: string) => {
    return getLeaveById(_id);
  });

  ipcMain.handle("leave:getLeaveByMonth", async (_, month: string) => {
    return getLeaveByMonth(month);
  });

  ipcMain.handle(
    "leave:update",
    async (
      _,
      _id,
      updates: {
        subject?: string;
        notes?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
      }
    ) => {
      return updateLeave(_id, updates);
    }
  );

  ipcMain.handle("leave:delete", async (_, _id: string) => {
    return deleteLeave(_id);
  });
}
