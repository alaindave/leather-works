import { BrowserWindow } from "electron";
import { SyncQueueItem } from "../../../common/types/sync.js";
import { all, run } from "../db.js";

async function notifyPendingChanges(): Promise<void> {
  try {
    const pendingItems = await getUnsyncedItems();
    const pendingChanges = pendingItems.length;

    console.log("PENDING CHANGES UPDATED:", pendingChanges);

    BrowserWindow.getAllWindows().forEach((window) => {
      if (!window.isDestroyed()) {
        window.webContents.send("sync:pending-changes", {
          pendingChanges,
          timestamp: new Date().toISOString(),
        });
      }
    });
  } catch (error) {
    console.error("FAILED TO NOTIFY PENDING CHANGES:", error);
  }
}

export async function addToSyncQueue(
  item: Omit<SyncQueueItem, "_id" | "synced" | "createdAt">
): Promise<number> {
  const result = await run(
    `
      INSERT INTO sync_queue (
        entity,
        entityId,
        operation,
        payload
      )
      VALUES (?, ?, ?, ?)
    `,
    [item.entity, item.entityId, item.operation, item.payload]
  );

  await notifyPendingChanges();

  return result.lastID;
}

export async function getUnsyncedItems(): Promise<SyncQueueItem[]> {
  return all(
    `
      SELECT *
      FROM sync_queue
      WHERE synced = 0
      ORDER BY createdAt ASC
    `
  );
}

export async function markManySynced(ids: string[]): Promise<void> {
  if (!ids.length) return;

  const placeholders = ids.map(() => "?").join(",");

  await run(
    `
      UPDATE sync_queue
      SET synced = 1
      WHERE _id IN (${placeholders})
    `,
    ids
  );

  await notifyPendingChanges();
}

export async function deleteSyncedItems(): Promise<void> {
  await run(
    `
      DELETE FROM sync_queue
      WHERE synced = 1
    `
  );

  await notifyPendingChanges();
}
