import { ipcMain } from "electron";
import { sync } from "../services/syncService.cjs";

export function registerSyncIPC() {
  console.log("REGISTERING SYNC IPC");
  ipcMain.handle("sync:run", async () => {
    try {
      await sync();

      return {
        success: true,
      };
    } catch (error) {
      console.error("Sync IPC failed:", error);

      return {
        success: false,
        message: "Sync failed",
      };
    }
  });
}
