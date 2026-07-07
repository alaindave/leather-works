import { ipcMain } from "electron";

import {
  createLeave,
  getLeaveById,
  getLeaveByMonth,
  getOngoingLeaves,
  updateLeave,
  deleteLeave,
} from "../database/repositories/leaves.repository.js";
import Leave from "../../shared/types/Leave.js";

export function registerLeaveIPC() {
  console.log("REGISTERING LEAVES IPC");
  ipcMain.handle("leave:create", async (_, leave: Partial<Leave>) => {
    return createLeave(leave);
  });

  ipcMain.handle("leave:getLeaveById", async (_, _id: string) => {
    return getLeaveById(_id);
  });

  ipcMain.handle("leave:getOnGoing", async () => {
    return getOngoingLeaves();
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
