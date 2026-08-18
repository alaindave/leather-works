import { ipcMain } from "electron";

import {
  createLeave,
  getLeaveById,
  getLeaveByEmployeeId,
  getLeaveByMonth,
  getOngoingLeaves,
  updateLeave,
  deleteLeave,
  cancelLeave,
} from "../database/repositories/leaves.repository.js";
import Leave from "../../common/types/Leave.js";

export function registerLeaveIPC() {
  console.log("REGISTERING LEAVES IPC");
  ipcMain.handle("leave:create", async (_, leave: Partial<Leave>) => {
    console.log("LEAVE IPC RECEIVED FOR EMPLOYEE:", leave.employeeId);
    return createLeave(leave);
  });

  ipcMain.handle(
    "leave:getLeaveByEmployeeId",
    async (_, employeeId: string) => {
      return getLeaveByEmployeeId(employeeId);
    }
  );

  ipcMain.handle("leave:getLeaveById", async (_, _id: string) => {
    return getLeaveById(_id);
  });

  ipcMain.handle("leave:getOnGoing", async (_, date: string) => {
    return getOngoingLeaves(date);
  });

  ipcMain.handle("leave:getLeaveByMonth", async (_, month: string) => {
    return getLeaveByMonth(month);
  });

  ipcMain.handle("leave:cancel", async (_, _id: string) => {
    return cancelLeave(_id);
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
