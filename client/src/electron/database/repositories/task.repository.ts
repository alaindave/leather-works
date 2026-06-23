import AdminUser from "../../../shared/types/AdminUser.js";
import type Task from "../../../shared/types/Task.js";
import { get, all, run } from "../db.js";
import { randomUUID } from "crypto";

export async function createTask(task: Task) {
  const _id = randomUUID();

  //Create task
  await run(
    `
    INSERT INTO tasks (
      _id,
      author,
      subject,
      message,
      deadline,
      priority,
      synced,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?,?,0, datetime('now'), datetime('now'))
    `,
    [_id, task.author, task.subject, task.message, task.deadline, task.priority]
  );

  // Insert recipients
  for (const recipient of task.recipients) {
    await run(
      `
      INSERT INTO task_recipients (taskId, recipient)
      VALUES (?, ?)
      `,
      [_id, recipient]
    );
  }

  return getTaskById(_id);
}

export async function getTaskById(_id: string) {
  const task = await get(
    `
    SELECT *
    FROM tasks
    WHERE _id = ?
    `,
    [_id]
  );

  if (!task) return null;

  const recipients: AdminUser[] = await all(
    `
    SELECT recipient
    FROM task_recipients
    WHERE taskId = ?
    `,
    [_id]
  );

  return {
    ...task,
    recipients,
  };
}

export async function getAllTasks() {
  return all(`
    SELECT *
    FROM tasks
    WHERE isDeleted = 0
    ORDER BY date DESC
  `);
}
