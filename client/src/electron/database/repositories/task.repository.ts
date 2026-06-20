import type Task from "../../../shared/types/Task.js";
import { get, all, run } from "../db.js";
import { randomUUID } from "crypto";

export async function createTask(task: Task) {
  const _id = randomUUID();

  await run(
    `
    INSERT INTO tasks (
      _id,
      author,
      subject,
      message,
      priority,
      synced,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?,0, datetime('now'), datetime('now'))
    `,
    [_id, task.author, task.subject, task.message, task.priority]
  );

  return getTaskById(_id);
}

export async function getTaskById(
  _id: string
): Promise<Task | undefined | null> {
  return get(
    `
    SELECT *
    FROM tasks
    WHERE _id = ?
    `,
    [_id]
  );
}

export async function getAllTasks() {
  return all(`
    SELECT *
    FROM tasks
    WHERE isDeleted = 0
    ORDER BY date DESC
  `);
}
