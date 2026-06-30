import type OfflineUser from "../../../shared/types/OfflineUser.js";
import { get, all, run } from "../db.js";
import { addToSyncQueue } from "./sync.repository.js";

export async function createOrUpdateOfflineUser(user: OfflineUser) {
  console.log("OFFLINE USER: ", user);

  await run(
    `
    INSERT INTO offline_users (
      _id,
      email,
      password,
      role,
      firstName,
      lastName,
      notes,
      lastVerifiedAt
    )
    VALUES (?, ?, ?, ?, ?, ?,?, ?)

    ON CONFLICT(email)
    DO UPDATE SET
      password = excluded.password,
      role = excluded.role,
      firstName = excluded.firstName,
      lastName = excluded.lastName,
      notes = excluded.notes,
      updatedAt = CURRENT_TIMESTAMP,
      lastVerifiedAt = excluded.lastVerifiedAt
    `,
    [
      user._id,
      user.email,
      user.password,
      user.role,
      user.firstName,
      user.lastName,
      user.notes,
      user.lastVerifiedAt,
    ]
  );

  return getOfflineUserByEmail(user.email);
}

export async function getOfflineUserById(
  _id: string
): Promise<OfflineUser | undefined | null> {
  return get(
    `
      SELECT *
      FROM offline_users
      WHERE _id = ?
      `,
    [_id]
  );
}

export async function getOfflineUserByEmail(
  email: string
): Promise<OfflineUser | undefined | null> {
  return get(
    `
      SELECT *
      FROM offline_users
      WHERE email = ?
      `,
    [email]
  );
}

export async function saveNotes(_id: string, notes: string) {
  const time = new Date().toISOString();
  await run(
    `
    UPDATE offline_users
    SET
      notes=?,
      updatedAt=datetime('now')
    WHERE _id=?
    `,
    [notes, _id]
  );

  const savedNotes = {
    _id,
    notes,
    createdAt: time,
    updatedAt: time,
  };

  console.log("Notes to save to sync queue", savedNotes);

  await addToSyncQueue({
    entity: "user_notes",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedNotes),
  });

  return getOfflineUserById(_id);
}

export async function getAllOfflineUsers() {
  return all(`
      SELECT *
      FROM offline_users
      ORDER BY firstName ASC
    `);
}

export async function updateLastVerifiedAt(_id: string) {
  await run(
    `
      UPDATE offline_users
      SET
        lastVerifiedAt = datetime('now'),
        updatedAt = datetime('now')
      WHERE _id = ?
      `,
    [_id]
  );

  return getOfflineUserById(_id);
}

export async function deleteOfflineUser(_id: string) {
  await run(
    `
      DELETE FROM offline_users
      WHERE _id = ?
      `,
    [_id]
  );

  return true;
}
