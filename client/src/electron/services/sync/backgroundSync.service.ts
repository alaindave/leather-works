import { NetworkService } from "./network.service.js";
import sync from "./sync.service.js";

const SYNC_INTERVAL = 3 * 60 * 1000;
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
      return;
    }
    console.log("BACKGROUND SYNC STARTED...");
    const result = await sync();
    console.log("BACKGROUND SYNC COMPLETED:", result);
  } catch (error) {
    console.error("BACKGROUND SYNC FAILED:", error);
  } finally {
    syncing = false;
  }
}
