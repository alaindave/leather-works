import { pushPendingChanges } from "./pushService.cjs";
import { pullLatestChanges } from "./pullService.cjs";

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
