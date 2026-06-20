import { pushPendingChanges } from "./pushService.js";
import { pullLatestChanges } from "./pullService.js";

let syncing = false;

export async function sync() {
  if (syncing) return;
  syncing = true;

  try {
    await pushPendingChanges();
    await pullLatestChanges();
  } catch (error) {
    console.error("Sync failed:", error);
  } finally {
    syncing = false;
  }
}
