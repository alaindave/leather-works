import AdminUser from "../../../shared/types/AdminUser.js";
import { get, all, run } from "../db.js";

export async function upsertAdminUser(adminUser: Partial<AdminUser>) {
  console.log("Admin user to upsert:", adminUser);

  try {
    await run(
      `
      INSERT INTO admin_users (
        _id,
        firstName,
        lastName,
        email,
        role,
        updatedAt,
        lastSyncedAt,
        isDeleted

      )
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
      ON CONFLICT(_id)
      DO UPDATE SET
        firstName = excluded.firstName,
        lastName = excluded.lastName,
        email= excluded.email,
        role = excluded.role,
        updatedAt = excluded.updatedAt,
        isDeleted=excluded.isDeleted

      `,
      [
        adminUser._id,
        adminUser.firstName,
        adminUser.lastName,
        adminUser.email,
        adminUser.role,
        adminUser.updatedAt ?? new Date().toISOString(),
        new Date().toISOString(),
        adminUser.isDeleted,
      ]
    );
  } catch (error) {
    console.error("AN ERROR OCCURED DURING ADMIN USERS UPSERT:", error);
  }
}

export async function getAllAdminUsers(): Promise<AdminUser[] | null> {
  return all(
    `
      SELECT *
      FROM admin_users
      ORDER BY lastName ASC
    `
  );
}

export async function getAdminUsersById(
  _id: string
): Promise<AdminUser | null> {
  return get(
    ` 
      SELECT *
      FROM admin_users
      WHERE _id = ?
    
    `,
    [_id]
  );
}
