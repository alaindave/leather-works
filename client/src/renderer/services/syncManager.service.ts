import useSyncStore from "../../store/sync.store";

let initialized = false;
let unsubscribe: (() => void) | null = null;

export function initializeRendererSync() {
  if (initialized) {
    return;
  }

  initialized = true;

  console.log("RENDERER SYNC MANAGER INITIALIZING...");

  unsubscribe = window.electron.onSyncCompleted(({ timestamp }) => {
    console.log("RENDERER RECEIVED SYNC COMPLETED:", timestamp);
    useSyncStore.getState().setSyncCompleted(timestamp);
  });

  console.log("RENDERER SYNC MANAGER INITIALIZED.");
}

export function destroyRendererSync() {
  if (!initialized) {
    return;
  }

  unsubscribe?.();

  unsubscribe = null;
  initialized = false;

  console.log("RENDERER SYNC MANAGER DESTROYED.");
}
