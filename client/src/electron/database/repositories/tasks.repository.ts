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
  isResolved?: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;

  authorId: string | null;
  authorFirstName: string | null;
  authorLastName: string | null;
  authorEmail: string | null;
  authorRole: string | null;

  recipientId: string | null;
  recipientFirstName: string | null;
  recipientLastName: string | null;
  recipientEmail: string | null;
  recipientRole: "manager" | "admin";
  isDeleted: number;
  submittedAt: string;
};

export async function createTask(task: Task) {
  console.log("Task to create:", task);
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
      task.author._id,
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

//Update task
export async function updateTask(task: Task) {
  const updatedAt = new Date().toISOString();

  await run("BEGIN TRANSACTION");

  try {
    await run(
      `
      UPDATE tasks
      SET
        subject = ?,
        message = ?,
        priority = ?,
        deadline = ?,
        isResolved = ?,
        resolutionNotes = ?,
        resolvedBy = ?,
        resolvedAt = ?,
        updatedAt = ?,
        synced = 0
      WHERE _id = ?
      `,
      [
        task.subject,
        task.message,
        task.priority,
        task.deadline,
        task.isResolved ?? 0,
        task.resolutionNotes ?? null,
        task.resolvedBy ?? null,
        task.resolvedAt ?? null,
        updatedAt,
        task._id,
      ]
    );

    // Replace recipients
    await run(`DELETE FROM task_recipients WHERE taskId = ?`, [task._id]);

    for (const recipient of task.recipients) {
      await run(
        `
        INSERT INTO task_recipients (
          taskId,
          recipient
        )
        VALUES (?, ?)
        `,
        [task._id, recipient._id]
      );
    }

    const updatedTask = {
      ...task,
      recipients: task.recipients.map((r) => r._id),
      updatedAt,
    };

    console.log("Task to save to sync queue", updatedTask);

    await addToSyncQueue({
      entity: "task",
      entityId: task._id,
      operation: "update",
      payload: JSON.stringify(updatedTask),
    });

    await run("COMMIT");
  } catch (error) {
    await run("ROLLBACK");
    throw error;
  }

  return getTaskById(task._id);
}

//Get task by ID
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
      t.isResolved,
      t.resolutionNotes,
      t.resolvedAt,
      t.resolvedBy,

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
    isResolved: rows[0].isResolved ?? null,
    resolutionNotes: rows[0].resolutionNotes ?? null,
    resolvedAt: rows[0].resolvedAt ?? null,
    resolvedBy: rows[0].resolvedBy ?? null,

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

//Get top tasks
export async function getTopTasks(userId: string) {
  const rows = await all<TaskRow>(
    `
    SELECT
      t._id AS taskId,
      t.taskNumber,
      t.subject,
      t.message,
      t.submittedAt,
      t.isDeleted,
      t.author,
      t.priority,
      t.deadline,
      t.isResolved,
      t.resolutionNotes,
      t.resolvedAt,
      t.resolvedBy,

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
    AND ( 
      t.author = ? 
      OR EXISTS (
      SELECT 1
      FROM task_recipients tr2
      WHERE tr2.taskId = t._id
        AND tr2.recipient = ?
    )
  )

    ORDER BY
      CASE t.priority
        WHEN 'Haute' THEN 3
        WHEN 'Moyenne' THEN 2
        WHEN 'Basse' THEN 1
        ELSE 0
      END DESC,
      datetime(t.createdAt) ASC

    LIMIT 5
    `,
    [userId, userId]
  );

  const map = new Map<string, Task>();

  for (const row of rows) {
    if (!map.has(row.taskId)) {
      map.set(row.taskId, {
        _id: row.taskId,
        taskNumber: row.taskNumber,
        subject: row.subject,
        message: row.message,
        priority: row.priority,
        deadline: row.deadline,
        isResolved: row.isResolved ?? null,
        resolutionNotes: row.resolutionNotes ?? null,
        resolvedAt: row.resolvedAt ?? null,
        resolvedBy: row.resolvedBy ?? null,
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
      } as Task);
    }

    const task = map.get(row.taskId)!;

    if (row.recipientId) {
      const exists = task.recipients.find((r) => r._id === row.recipientId);

      if (!exists) {
        task.recipients.push({
          _id: row.recipientId,
          firstName: row.recipientFirstName!,
          lastName: row.recipientLastName!,
          email: row.recipientEmail!,
          role: row.recipientRole!,
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
//Get all tasks
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
      t.isResolved,
      t.resolutionNotes,
      t.resolvedAt,
      t.resolvedBy,

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
        isResolved: row.isResolved ?? null,
        resolutionNotes: row.resolutionNotes ?? null,
        resolvedAt: row.resolvedAt ?? null,
        resolvedBy: row.resolvedBy ?? null,
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

export async function deleteTask(_id: string) {
  await run(
    `
    UPDATE tasks
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = datetime('now')
    WHERE _id = ?
    `,
    [_id]
  );

  const updatedAt = new Date().toISOString();

  console.log("Task to delete from sync queue", { _id, updatedAt });

  await addToSyncQueue({
    entity: "task",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({ _id, updatedAt }),
  });

  return getTaskById(_id);
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

export async function upsertTask(task: Task) {
  console.log("Task to upsert:", task);
  await run("BEGIN TRANSACTION");

  try {
    // Check if task already exists locally
    const existing = await all<{ updatedAt: string | null }>(
      `
      SELECT updatedAt
      FROM tasks
      WHERE _id = ?
      `,
      [task._id]
    );

    // Local version is newer -> don't overwrite it
    if (
      existing.length &&
      existing[0].updatedAt &&
      task.updatedAt &&
      new Date(existing[0].updatedAt).getTime() >
        new Date(task.updatedAt).getTime()
    ) {
      await run("ROLLBACK");
      return getTaskById(task._id);
    }

    await run(
      `
      INSERT INTO tasks (
        _id,
        taskNumber,
        author,
        subject,
        message,
        priority,
        deadline,
        isResolved,
        resolutionNotes,
        resolvedBy,
        resolvedAt,
        submittedAt,
        createdAt,
        updatedAt,
        lastSyncedAt,
        synced,
        isDeleted
      )
      VALUES (
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
      )
      ON CONFLICT(_id) DO UPDATE SET
        taskNumber = excluded.taskNumber,
        author = excluded.author,
        subject = excluded.subject,
        message = excluded.message,
        priority = excluded.priority,
        deadline = excluded.deadline,
        isResolved = excluded.isResolved,
        resolutionNotes = excluded.resolutionNotes,
        resolvedBy = excluded.resolvedBy,
        resolvedAt = excluded.resolvedAt,
        submittedAt = excluded.submittedAt,
        createdAt = excluded.createdAt,
        updatedAt = excluded.updatedAt,
        lastSyncedAt = excluded.lastSyncedAt,
        synced = 1,
        isDeleted = excluded.isDeleted
      `,
      [
        task._id,
        task.taskNumber,
        task.author,
        task.subject,
        task.message,
        task.priority,
        task.deadline,
        task.isResolved ?? 0,
        task.resolutionNotes ?? null,
        task.resolvedBy ?? null,
        task.resolvedAt ?? null,
        task.submittedAt ?? null,
        task.createdAt ?? null,
        task.updatedAt ?? null,
        task.lastSyncedAt ?? new Date().toISOString(),
        1,
        task.isDeleted ?? 0,
      ]
    );

    // Replace recipients
    await run(`DELETE FROM task_recipients WHERE taskId = ?`, [task._id]);

    for (const recipient of task.recipients) {
      await run(
        `
        INSERT INTO task_recipients (
          taskId,
          recipient
        )
        VALUES (?, ?)
        `,
        [task._id, recipient]
      );
    }

    await run("COMMIT");

    return getTaskById(task._id);
  } catch (err) {
    await run("ROLLBACK");
    throw err;
  }
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
