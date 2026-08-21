import { ipcMain } from "electron";
import sync from "../services/sync/sync.service.js";

export function registerSyncIPC() {
  console.log("REGISTERING SYNC IPC");
  ipcMain.handle("sync:run", async () => {
    try {
      await sync();
      return {
        success: true,
      };
    } catch (error) {
      console.error("SYNC IPC FAILED:", error);

      return {
        success: false,
        message: "Sync failed",
      };
    }
  });
}
