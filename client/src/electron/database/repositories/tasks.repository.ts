import type Task from "../../../common/types/Task.js";
import { all, get, run } from "../db.js";
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
  recipientRole: "MANAGER" | "ADMIN";

  isDeleted: number;
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
  serverVersion: number;
};

/**
 * Create task locally.
 *
 * serverVersion starts at 0 because the task has not yet been
 * assigned a server revision.
 */
export async function createTask(task: Task) {
  console.log("TASK TO CREATE:", task);

  const _id = randomUUID();
  const taskNumber = generateTaskNumber(task.priority);
  const now = new Date().toISOString();

  const serverVersion = 0;

  // Create task
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
      synced,
      serverVersion,
      submittedAt,
      createdAt,
      updatedAt,
      isDeleted
    )
    VALUES (?,?,?,?,?,?,?,0,?,?,?,?,0)
    `,
    [
      _id,
      taskNumber,
      task.author._id,
      task.subject,
      task.message,
      task.deadline,
      task.priority,
      serverVersion,
      now,
      now,
      now,
    ]
  );

  // Insert recipients
  for (const recipient of task.recipients) {
    await run(
      `
      INSERT INTO task_recipients (
        taskId,
        recipient
      )
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
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
    serverVersion,
    isDeleted: 0,
  };

  console.log("TASK TO SAVE TO SYNC QUEUE", savedTask);

  await addToSyncQueue({
    entity: "task",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedTask),
  });

  return getTaskById(_id);
}

/**
 * Update task locally.
 *
 * Important:
 * serverVersion is intentionally NOT changed here.
 * The server assigns the next serverVersion when the change
 * is accepted by the backend.
 */
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
        AND isDeleted = 0
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
    await run(
      `
      DELETE FROM task_recipients
      WHERE taskId = ?
      `,
      [task._id]
    );

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

    const existing = await get<{ serverVersion: number }>(
      `
      SELECT serverVersion
      FROM tasks
      WHERE _id = ?
      `,
      [task._id]
    );

    const updatedTask = {
      ...task,
      recipients: task.recipients.map((r) => r._id),
      updatedAt,
      serverVersion: existing?.serverVersion ?? task.serverVersion ?? 0,
    };

    console.log("TASK TO SAVE TO SYNC QUEUE", updatedTask);

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

/**
 * Get task by ID.
 */
export async function getTaskById(_id: string) {
  const row = await get<
    TaskRow & {
      serverVersion: number;
    }
  >(
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
      t.submittedAt,
      t.createdAt,
      t.updatedAt,
      t.isDeleted,
      t.serverVersion,

      -- author
      a._id AS author,
      a.firstName AS authorFirstName,
      a.lastName AS authorLastName,
      a.email AS authorEmail,
      a.role AS authorRole

    FROM tasks t

    LEFT JOIN admin_users a 
      ON a._id = t.author

    WHERE t._id = ?
    `,
    [_id]
  );

  if (!row) return null;

  // Fetch all recipients for this task
  const recipients = await all<{
    _id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string | null;
  }>(
    `
    SELECT
      u._id,
      u.firstName,
      u.lastName,
      u.email,
      u.role
    FROM task_recipients tr

    LEFT JOIN admin_users u
      ON u._id = tr.recipient

    WHERE tr.taskId = ?
    `,
    [_id]
  );

  const comments = await getTaskCommentsWithAuthor(_id);

  return {
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
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isDeleted: row.isDeleted,
    serverVersion: row.serverVersion,

    author: {
      _id: row.author,
      firstName: row.authorFirstName,
      lastName: row.authorLastName,
      email: row.authorEmail,
      role: row.authorRole,
    },

    recipients,

    comments,
  };
}

/**
 * Get top tasks for dashboard display.
 */
export async function getTopTasks(userId: string) {
  const rows = await all<TaskRow>(
    `
    SELECT
      t._id AS taskId,
      t.taskNumber,
      t.subject,
      t.message,
      t.submittedAt,
      t.createdAt,
      t.updatedAt,
      t.isDeleted,
      t.author,
      t.priority,
      t.deadline,
      t.isResolved,
      t.resolutionNotes,
      t.resolvedAt,
      t.resolvedBy,
      t.serverVersion,

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
      AND t.isResolved = 0
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
      CASE
        WHEN t.deadline IS NULL THEN 1
        ELSE 0
      END ASC,

      datetime(t.deadline) ASC,

      CASE t.priority
        WHEN 'Haute' THEN 3
        WHEN 'Moyenne' THEN 2
        WHEN 'Basse' THEN 1
        ELSE 0
      END DESC,

      datetime(t.createdAt) ASC
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
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        serverVersion: row.serverVersion,

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

/**
 * Get all tasks for a user.
 */
export async function getAllTasksForUser(userId: string) {
  const rows = await all<TaskRow>(
    `
    SELECT
      t._id AS taskId,
      t.taskNumber,
      t.subject,
      t.message,
      t.submittedAt,
      t.createdAt,
      t.updatedAt,
      t.isDeleted,
      t.author,
      t.priority,
      t.deadline,
      t.isResolved,
      t.resolutionNotes,
      t.resolvedAt,
      t.resolvedBy,
      t.serverVersion,

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

      datetime(t.createdAt) DESC
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
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        isDeleted: row.isDeleted,
        serverVersion: row.serverVersion,

        author: {
          _id: row.author,
          firstName: row.authorFirstName,
          lastName: row.authorLastName,
          email: row.authorEmail,
          role: row.authorRole,
        },

        recipients: [],

        comments: [],
      } as Task);
    }

    const task = map.get(row.taskId)!;

    if (row.recipientId) {
      const exists = task.recipients.some(
        (recipient) => recipient._id === row.recipientId
      );

      if (!exists) {
        task.recipients.push({
          _id: row.recipientId,
          firstName: row.recipientFirstName ?? "",
          lastName: row.recipientLastName ?? "",
          email: row.recipientEmail ?? "",
          role: row.recipientRole ?? "",
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

/**
 * Get all tasks.
 */
export async function getAllTasks() {
  const rows = await all<TaskRow>(
    `
    SELECT 
      t._id AS taskId,
      t.taskNumber AS taskNumber,
      t.subject,
      t.message,
      t.submittedAt,
      t.createdAt,
      t.updatedAt,
      t.isDeleted,
      t.author,
      t.priority,
      t.deadline,
      t.isResolved,
      t.resolutionNotes,
      t.resolvedAt,
      t.resolvedBy,
      t.serverVersion,

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
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        isDeleted: row.isDeleted,
        serverVersion: row.serverVersion,

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
          firstName: row.recipientFirstName ?? "",
          lastName: row.recipientLastName ?? "",
          email: row.recipientEmail ?? "",
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

/**
 * Soft delete task.
 *
 * serverVersion is intentionally left unchanged.
 * The server will assign the next version when this deletion
 * is synchronized.
 */
export async function deleteTask(_id: string) {
  const updatedAt = new Date().toISOString();

  await run(
    `
    UPDATE tasks
    SET
      isDeleted = 1,
      synced = 0,
      updatedAt = ?
    WHERE _id = ?
      AND isDeleted = 0
    `,
    [updatedAt, _id]
  );

  console.log("TASK TO DELETE FROM SYNC QUEUE", {
    _id,
    updatedAt,
  });

  await addToSyncQueue({
    entity: "task",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({
      _id,
      isDeleted: 1,
      updatedAt,
    }),
  });

  return getTaskById(_id);
}

/**
 * Mark task as synchronized.
 */
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
  console.log("TASK TO UPSERT:", task);

  const incomingServerVersion = task.serverVersion ?? 0;

  // Check existing local task.
  const existing = await get<{
    serverVersion: number;
    synced: number;
    updatedAt: string | null;
  }>(
    `
    SELECT
      serverVersion,
      synced,
      updatedAt
    FROM tasks
    WHERE _id = ?
    `,
    [task._id]
  );

  /**
   * If the local record has a newer serverVersion,
   * the incoming server record is stale.
   *
   * Do not overwrite it.
   */
  if (existing && existing.serverVersion > incomingServerVersion) {
    console.log(
      `SKIPPING TASK ${task._id}: LOCAL serverVersion ${existing.serverVersion} IS NEWER THAN INCOMING${incomingServerVersion}`
    );

    return getTaskById(task._id);
  }

  /**
   * Server version is equal or newer.
   *
   * Accept the server record.
   */
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
      serverVersion,
      isDeleted
    )
    VALUES (
      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
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
      serverVersion = excluded.serverVersion,
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
      new Date().toISOString(),
      1,
      incomingServerVersion,
      task.isDeleted ?? 0,
    ]
  );

  // Replace recipients with server recipients.
  await run(
    `
    DELETE FROM task_recipients
    WHERE taskId = ?
    `,
    [task._id]
  );

  for (const recipient of task.recipients) {
    const recipientId =
      typeof recipient === "string" ? recipient : recipient._id;

    if (!recipientId) continue;

    await run(
      `
      INSERT INTO task_recipients (
        taskId,
        recipient
      )
      VALUES (?, ?)
      `,
      [task._id, recipientId]
    );
  }

  return getTaskById(task._id);
}

/**
 * Map task priorities to single letters.
 */
function taskMapping(task_priority: string): string {
  if (task_priority === "HAUTE") return "H";
  if (task_priority === "MOYENNE") return "M";
  return "B";
}

/**
 * Generate task numbers.
 */
function generateTaskNumber(task_priority: string) {
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

  const priority_letter = taskMapping(task_priority);

  return `TACHE-${date}-${time}-${random}-${priority_letter}`;
}
