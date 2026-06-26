import type Task from "../../../shared/types/Task.js";
import { all, run } from "../db.js";
import { addToSyncQueue } from "./sync.repository.js";
import { randomUUID } from "crypto";
import { getTaskCommentsWithAuthor } from "./tasks_comments.repository.js";
type Priority = "Haute" | "Moyenne" | "Basse" | "";

type TaskRow = {
  taskId: string;
  taskNumber: string;
  subject: string;
  message: string;
  author: string;
  priority: Priority;
  deadline: string;

  authorId: string | null;
  authorFirstName: string | null;
  authorLastName: string | null;
  authorEmail: string | null;
  authorRole: string | null;

  recipientId: string | null;
  recipientFirstName: string | null;
  recipientLastName: string | null;
  recipientEmail: string | null;
  recipientRole: string | null;
  isDeleted: number;
  submittedAt: string;
};

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
    taskNumber,
    recipients: task.recipients.map((r) => r._id),
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
  const rows = await all<TaskRow>(
    `
    SELECT 
      t._id AS taskId,
      t.taskNumber,
      t.subject,
      t.message,
      t.author,
      t.priority,
      t.deadline,

      -- author
      a._id AS author,
      a.firstName AS authorFirstName,
      a.lastName AS authorLastName,
      a.email AS authorEmail,
      a.role AS authorRole,

      -- recipient
      r._id AS recipientId,
      r.firstName AS recipientFirstName,
      r.lastName AS recipientLastName,
      r.email AS recipientEmail,
      r.role AS recipientRole

    FROM tasks t

    LEFT JOIN admin_users a 
      ON a._id = t.author

    LEFT JOIN task_recipients tr 
      ON tr.taskId = t._id

    LEFT JOIN admin_users r 
      ON r._id = tr.recipient

    WHERE t._id = ?
    `,
    [_id]
  );

  if (!rows.length) return null;

  const taskMap = {
    _id: rows[0].taskId,
    taskNumber: rows[0].taskNumber,
    subject: rows[0].subject,
    message: rows[0].message,
    priority: rows[0].priority,
    deadline: rows[0].deadline,

    author: {
      _id: rows[0].author,
      firstName: rows[0].authorFirstName,
      lastName: rows[0].authorLastName,
      email: rows[0].authorEmail,
      role: rows[0].authorRole,
    },

    recipients: [] as {
      _id: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      role: string | null;
    }[],
  };

  const seen = new Set();

  for (const row of rows) {
    if (row.recipientId && !seen.has(row.recipientId)) {
      seen.add(row.recipientId);

      taskMap.recipients.push({
        _id: row.recipientId,
        firstName: row.recipientFirstName,
        lastName: row.recipientLastName,
        email: row.recipientEmail,
        role: row.recipientRole,
      });
    }
  }

  const comments = await getTaskCommentsWithAuthor(_id);

  return {
    ...taskMap,
    comments,
  };
}

export async function getAllTasks() {
  const rows = await all<TaskRow>(
    `
    SELECT 
      t._id AS taskId,
      t.taskNumber AS taskNumber,
      t.subject,
      t.message,
      t.submittedAt,
      t.isDeleted,
      t.author,
      t.priority,
      t.deadline,

      -- author
      a._id AS author,
      a.firstName AS authorFirstName,
      a.lastName AS authorLastName,
      a.email AS authorEmail,
      a.role AS authorRole,

      -- recipient
      r._id AS recipientId,
      r.firstName AS recipientFirstName,
      r.lastName AS recipientLastName,
      r.email AS recipientEmail,
      r.role AS recipientRole

    FROM tasks t

    LEFT JOIN admin_users a 
      ON a._id = t.author

    LEFT JOIN task_recipients tr 
      ON tr.taskId = t._id

    LEFT JOIN admin_users r 
      ON r._id = tr.recipient

    WHERE t.isDeleted = 0
    ORDER BY t.submittedAt DESC
    `
  );

  const map = new Map<string, any>();

  for (const row of rows) {
    if (!map.has(row.taskId)) {
      map.set(row.taskId, {
        _id: row.taskId,
        taskNumber: row.taskNumber,
        subject: row.subject,
        message: row.message,
        priority: row.priority,
        deadline: row.deadline,
        submittedAt: row.submittedAt,
        isDeleted: row.isDeleted,

        author: {
          _id: row.author,
          firstName: row.authorFirstName,
          lastName: row.authorLastName,
          email: row.authorEmail,
          role: row.authorRole,
        },

        recipients: [],
      });
    }

    const task = map.get(row.taskId);

    if (row.recipientId) {
      const exists = task.recipients.find(
        (r: any) => r._id === row.recipientId
      );

      if (!exists) {
        task.recipients.push({
          _id: row.recipientId,
          firstName: row.recipientFirstName,
          lastName: row.recipientLastName,
          email: row.recipientEmail,
          role: row.recipientRole,
        });
      }
    }
  }

  const tasks = Array.from(map.values());

  await Promise.all(
    tasks.map(async (task) => {
      task.comments = await getTaskCommentsWithAuthor(task._id);
    })
  );

  return tasks;
}

export async function markTaskSynced(_id: string) {
  await run(
    `
    UPDATE tasks
    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );

  return true;
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
