import type SyncQueueItem from "../../../shared/types/SyncQueueItem";
import { all, run } from "../db.cjs";

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

export async function markManySynced(ids: number[]): Promise<void> {
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
}

export async function deleteSyncedItems(): Promise<void> {
  await run(
    `
      DELETE FROM sync_queue
      WHERE synced = 1
      `
  );
}
