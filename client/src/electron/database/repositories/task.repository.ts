import AdminUser from "../../../shared/types/User.js";
import type Task from "../../../shared/types/Task.js";
import { get, all, run } from "../db.js";
import { randomUUID } from "crypto";
import { addToSyncQueue } from "./sync.repository.js";

export async function createTask(task: Task) {
  const _id = randomUUID();
  const taskNumber = generateTaskNumber();
  const today = new Date();
  const submittedAt = today.toISOString().split("T")[0];
  const time = today.toISOString();

  //Create task
  await run(
    `
    INSERT INTO tasks (
      _id,
      taskNumber,
      author,
      subject,
      message,
      deadline,
      priority,
      submittedAt,
      synced,
      createdAt,
      updatedAt
    )
    VALUES (?,?,?,?,?,?,?,?,0, datetime('now'), datetime('now'))
    `,
    [
      _id,
      taskNumber,
      task.author,
      task.subject,
      task.message,
      task.deadline,
      task.priority,
      submittedAt,
    ]
  );

  // Insert recipients
  for (const recipient of task.recipients) {
    await run(
      `
      INSERT INTO task_recipients (taskId, recipient)
      VALUES (?, ?)
      `,
      [_id, recipient._id]
    );
  }

  const savedTask = {
    ...task,
    _id,
    submittedAt,
    createdAt: time,
    updatedAt: time,
  };

  console.log("Task to save to sync queue", savedTask);

  await addToSyncQueue({
    entity: "task",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedTask),
  });

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

//Generate task numbers
function generateTaskNumber() {
  const now = new Date();

  const date =
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0") +
    now.getFullYear();

  const time =
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `TACHE-${date}-${time}-${random}`;
}
