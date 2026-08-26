import { SyncStatusEvent } from "../../common/types/sync";
import useSyncStore from "../../store/sync.store";

let initialized = false;

let unsubscribeSyncStatus: (() => void) | null = null;
let unsubscribePendingChanges: (() => void) | null = null;

export function initializeRendererSync() {
  if (initialized) {
    return;
  }

  initialized = true;

  console.log("RENDERER SYNC MANAGER INITIALIZING...");

  unsubscribeSyncStatus = window.electron.onSyncStatus(
    ({ status, timestamp }: SyncStatusEvent) => {
      const syncStore = useSyncStore.getState();

      console.log("RENDERER RECEIVED SYNC STATUS:", status, timestamp ?? "");

      switch (status) {
        case "IDLE":
          if (timestamp) {
            syncStore.setSyncCompleted(timestamp);
          } else {
            syncStore.resetSyncStatus();
          }
          break;

        case "SYNCING":
          syncStore.setSyncing();
          break;

        case "OFFLINE":
          syncStore.setOffline();
          break;

        case "ERROR":
          syncStore.setSyncError();
          break;

        default:
          console.warn("RENDERER RECEIVED UNKNOWN SYNC STATUS:", status);
      }
    }
  );

  unsubscribePendingChanges = window.electron.onPendingChanges(
    ({ pendingChanges, timestamp }) => {
      const syncStore = useSyncStore.getState();

      console.log(
        "RENDERER RECEIVED PENDING CHANGES:",
        pendingChanges,
        timestamp
      );

      syncStore.setPendingChanges(pendingChanges);
    }
  );

  console.log("RENDERER SYNC MANAGER INITIALIZED.");
}

export function destroyRendererSync() {
  if (!initialized) {
    return;
  }

  /*
   * Remove sync status listener.
   */
  unsubscribeSyncStatus?.();

  /*
   * Remove pending changes listener.
   */
  unsubscribePendingChanges?.();

  unsubscribeSyncStatus = null;
  unsubscribePendingChanges = null;

  initialized = false;

  console.log("RENDERER SYNC MANAGER DESTROYED.");
}
