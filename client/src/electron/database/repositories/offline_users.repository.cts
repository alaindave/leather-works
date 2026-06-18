import type OfflineUser from "../../../shared/types/OfflineUser";
import { get, all, run } from "../db.cjs";

export async function createOrUpdateOfflineUser(user: OfflineUser) {
  await run(
    `
    INSERT INTO offline_users (
      _id,
      email,
      passwordHash,
      role,
      firstName,
      lastName,
      lastVerifiedAt,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))

    ON CONFLICT(email)
    DO UPDATE SET
      passwordHash = excluded.passwordHash,
      role = excluded.role,
      firstName = excluded.firstName,
      lastName = excluded.lastName,
      lastVerifiedAt = excluded.lastVerifiedAt,
      updatedAt = datetime('now')
    `,
    [
      user._id,
      user.email,
      user.passwordHash,
      user.role,
      user.firstName,
      user.lastName,
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
