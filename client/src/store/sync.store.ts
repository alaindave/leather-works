import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SyncStore {
  lastSyncAt: string | null;
  syncVersion: number;
  setSyncCompleted: (timestamp: string) => void;
}

const useSyncStore = create<SyncStore>()(
  persist(
    (set) => ({
      lastSyncAt: null,
      syncVersion: 0,

      setSyncCompleted: (timestamp) =>
        set((state) => ({
          lastSyncAt: timestamp,
          syncVersion: state.syncVersion + 1,
        })),
    }),
    {
      name: "sync-store",
      // Only persist the actual sync timestamp.
      partialize: (state) => ({
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);

export default useSyncStore;
