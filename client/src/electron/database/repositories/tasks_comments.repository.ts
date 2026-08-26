import TaskComment from "../../../common/types/TaskComment.js";
import { randomUUID } from "crypto";
import { run, all } from "../db.js";
import { addToSyncQueue } from "./sync.repository.js";
import PopulatedTaskComment from "../../../common/types/PopulatedTaskComment.js";

//Create task comment
export async function createTaskComment(comment: TaskComment) {
  console.log("Comment to save:", comment);
  const _id = randomUUID();
  const today = new Date();
  const submittedAt = today.toISOString().split("T")[0];
  const time = today.toISOString();

  await run(
    `
    INSERT INTO task_comments (
      _id,
      taskId,
      author,
      comment,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [_id, comment.taskId, comment.author, comment.comment, time, time]
  );

  const savedTaskComment = {
    ...comment,
    _id,
    submittedAt,
    createdAt: time,
    updatedAt: time,
  };

  console.log("TASK COMMENT TO SAVE TO SYNC QUEUE", savedTaskComment);

  await addToSyncQueue({
    entity: "task_comment",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedTaskComment),
  });

  return savedTaskComment;
}

//Get task comments
export async function getTaskComments(taskId: string): Promise<TaskComment[]> {
  return all(
    `
    SELECT 
      tc._id,
      tc.taskId,
      tc.comment,
      tc.createdAt,
      tc.updatedAt,

      a._id AS author,
      a.firstName,
      a.lastName,
      a.email,
      a.role

    FROM task_comments tc
    JOIN admin_users a ON a._id = tc.author
    WHERE tc.taskId = ?
    ORDER BY tc.createdAt ASC
    `,
    [taskId]
  );
}

//Formatted task comments
export async function getTaskCommentsWithAuthor(taskId: string) {
  const rows = await getTaskComments(taskId);

  return rows.map((r: any) => ({
    _id: r._id,
    taskId: r.taskId,
    comment: r.comment,
    createdAt: r.createdAt,

    author: {
      _id: r.author,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      role: r.role,
    },
  }));
}

//Update comments
export async function updateTaskComment(_id: string, comment: string) {
  const today = new Date();
  const updatedAt = today.toISOString();

  await run(
    `
    UPDATE task_comments
    SET comment = ?, updatedAt = ?
    WHERE _id = ?
    `,
    [comment, updatedAt, _id]
  );

  await addToSyncQueue({
    entity: "task_comment",
    entityId: _id,
    operation: "update",
    payload: JSON.stringify({
      _id,
      comment,
      updatedAt,
    }),
  });
}

//Delete comments
export async function deleteTaskComment(_id: string) {
  const today = new Date();
  const updatedAt = today.toISOString();
  await run(
    `
    DELETE FROM task_comments
    WHERE _id = ?
    `,
    [_id]
  );

  await addToSyncQueue({
    entity: "task_comment",
    entityId: _id,
    operation: "delete",
    payload: JSON.stringify({
      _id,
      updatedAt,
    }),
  });
}

export async function upsertTaskComment(comment: PopulatedTaskComment) {
  await run(
    `
    INSERT INTO task_comments (
      _id,
      taskId,
      author,
      comment,
      serverVersion,
      createdAt,
      updatedAt,
      isDeleted
    )
    VALUES (?,?,?,?,?,?,?,?)

    ON CONFLICT(_id)
    DO UPDATE SET
      author = excluded.author,
      comment = excluded.comment,
      serverVersion = excluded.serverVersion,
      updatedAt = excluded.updatedAt,
      isDeleted = excluded.isDeleted
    `,
    [
      comment._id,
      comment.taskId,
      comment.author,
      comment.comment,
      comment.serverVersion,
      comment.createdAt,
      comment.updatedAt,
      comment.isDeleted,
    ]
  );

  console.log("COMMENT UPSERTED:", comment);
}

export async function markTaskCommentsSynced(_id: string) {
  await run(
    `
    UPDATE task_comments
    SET
      synced = 1,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [_id]
  );

  return true;
}
