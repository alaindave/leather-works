import TaskRecipient from "../../../shared/types/TaskRecipient.js";
import { get, all, run } from "../db.js";

export async function upsertTaskRecipient(
  taskRecipient: Partial<TaskRecipient>
) {
  await run(
    `
      INSERT INTO task_recipients (
        _id,
        firstName,
        lastName,
        email,
        role,
        isDeleted,
        updatedAt,
        lastSyncedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
      ON CONFLICT(_id)
      DO UPDATE SET
        firstName = excluded.firstName,
        lastName = excluded.lastName,
        email = excluded.email,
        role = excluded.role,
        isDeleted=excluded.isDeleted,
        updatedAt = excluded.updatedAt
      `,
    [
      taskRecipient._id,
      taskRecipient.firstName,
      taskRecipient.lastName,
      taskRecipient.email,
      taskRecipient.role,
      taskRecipient.isDeleted,
      taskRecipient.updatedAt ?? new Date().toISOString(),
      new Date().toISOString(),
    ]
  );
}

export async function getAllTaskRecipients(): Promise<TaskRecipient[] | null> {
  return all(
    `
      SELECT *
      FROM task_recipients
      ORDER BY lastName ASC
    `
  );
}

export async function getTaskRecipientById(
  _id: string
): Promise<TaskRecipient | null> {
  return get(
    ` 
      SELECT *
      FROM task_recipients
      WHERE _id = ?
    
    `,
    [_id]
  );
}
