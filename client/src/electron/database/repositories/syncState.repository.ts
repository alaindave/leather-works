import { get, run } from "../db.js";

export interface SyncState {
  entity: string;
  lastPulledVersion: number;
  lastPushedVersion: number;
  updatedAt: string;
}

export async function getSyncState(entity: string): Promise<SyncState> {
  const existing = await get<SyncState>(
    `
      SELECT
        entity,
        lastPulledVersion,
        lastPushedVersion,
        updatedAt
      FROM sync_state
      WHERE entity = ?
      LIMIT 1
    `,
    [entity]
  );

  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();

  await run(
    `
      INSERT INTO sync_state (
        entity,
        lastPulledVersion,
        lastPushedVersion,
        updatedAt
      )
      VALUES (?, 0, 0, ?)
    `,
    [entity, now]
  );

  return {
    entity,
    lastPulledVersion: 0,
    lastPushedVersion: 0,
    updatedAt: now,
  };
}

export async function updateLastPulledVersion(
  entity: string,
  version: number
): Promise<void> {
  const now = new Date().toISOString();

  await run(
    `
      INSERT INTO sync_state (
        entity,
        lastPulledVersion,
        lastPushedVersion,
        updatedAt
      )
      VALUES (?, ?, 0, ?)

      ON CONFLICT(entity)
      DO UPDATE SET
        lastPulledVersion = excluded.lastPulledVersion,
        updatedAt = excluded.updatedAt
    `,
    [entity, version, now]
  );
}

export async function updateLastPushedVersion(
  entity: string,
  version: number
): Promise<void> {
  const now = new Date().toISOString();

  await run(
    `
      INSERT INTO sync_state (
        entity,
        lastPulledVersion,
        lastPushedVersion,
        updatedAt
      )
      VALUES (?, 0, ?, ?)

      ON CONFLICT(entity)
      DO UPDATE SET
        lastPushedVersion = excluded.lastPushedVersion,
        updatedAt = excluded.updatedAt
    `,
    [entity, version, now]
  );
}
