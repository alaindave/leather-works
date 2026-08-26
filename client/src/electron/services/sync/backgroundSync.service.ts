import { BrowserWindow } from "electron";
import { NetworkService } from "./network.service.js";
import sync from "./sync.service.js";

const SYNC_INTERVAL = 2 * 60 * 1000;

let syncInterval: NodeJS.Timeout | null = null;
let syncing = false;

export function startBackgroundSync() {
  if (syncInterval) {
    console.log("BACKGROUND SYNC ALREADY STARTED");
    return;
  }

  console.log("STARTING BACKGROUND SYNC...");

  // Perform one immediately when Electron starts
  runBackgroundSync();

  syncInterval = setInterval(() => {
    runBackgroundSync();
  }, SYNC_INTERVAL);
}

export function stopBackgroundSync() {
  if (!syncInterval) {
    return;
  }

  clearInterval(syncInterval);
  syncInterval = null;

  console.log("BACKGROUND SYNC STOPPED");
}

async function runBackgroundSync() {
  if (syncing) {
    console.log("SYNC ALREADY IN PROGRESS. SKIPPING...");
    return;
  }

  syncing = true;

  try {
    const backendAvailable = await NetworkService.canReachBackend();

    if (!backendAvailable) {
      console.log("BACKEND UNAVAILABLE. BACKGROUND SYNC SKIPPED.");

      notifyRenderer({
        status: "OFFLINE",
        timestamp: new Date().toISOString(),
      });

      return;
    }

    console.log("BACKGROUND SYNC STARTED...");

    await sync();

    console.log("BACKGROUND SYNC COMPLETED");
  } catch (error) {
    console.error("BACKGROUND SYNC FAILED:", error);

    notifyRenderer({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: getErrorMessage(error),
    });
  } finally {
    syncing = false;
  }
}

/**
 * Notify all renderer windows about the current sync state.
 */
function notifyRenderer(event: {
  status: "OFFLINE" | "ERROR";
  timestamp: string;
  error?: string;
}) {
  console.log("BACKGROUND SYNC EVENT:", event);

  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send("sync:status", event);
    }
  });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
