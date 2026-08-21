import { app } from "electron";
import { BrowserWindow } from "electron";
import { pushPendingChanges } from "./push.service.js";
import { pullLatestChanges } from "./pull.service.js";
import { NetworkService } from "./network.service.js";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

let syncing = false;

export default async function sync() {
  console.log("SYNC SERVICE API URL:", API_URL);
  if (syncing) return;
  syncing = true;
  try {
    const backendAvailable = await NetworkService.canReachBackend();
    if (!backendAvailable) {
      console.log("BACKEND UNAVAILABLE.SYNC SKIPPED.");
      return;
    }
    // PUSH
    try {
      const result = await pushPendingChanges();
      if (result) {
        console.log("PUSH RESULTS: ", result.status);
      }
      console.log("NO MORE ITEMS TO PUSH");
    } catch (error) {
      console.error("PUSH FAILED:", error);
    }

    // PULL
    try {
      const result = await pullLatestChanges();
      console.log("PULL RESULTS: ", result.status);
      notifyRendererSyncCompleted();
    } catch (error) {
      console.error("PULL FAILED:", error);
    }
  } catch (error) {
    console.error("PUSH/PULL SYNC FAILED:", error);
  } finally {
    syncing = false;
  }
}

function notifyRendererSyncCompleted() {
  console.log("NOTIFY RENDERER CALLED");
  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send("sync:completed", {
        timestamp: new Date().toISOString(),
      });
    }
  });
}
