import TaskComment from "../../../shared/types/TaskComment.js";
import { randomUUID } from "crypto";
import { run, all } from "../db.js";
import { addToSyncQueue } from "./sync.repository.js";

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
      message
    )
    VALUES (?, ?, ?, ?)
    `,
    [_id, comment.taskId, comment.author, comment.message]
  );

  const savedTaskComment = {
    ...comment,
    submittedAt,
    createdAt: time,
    updatedAt: time,
  };

  console.log("Task to save to sync queue", savedTaskComment);

  await addToSyncQueue({
    entity: "task_comment",
    entityId: _id,
    operation: "create",
    payload: JSON.stringify(savedTaskComment),
  });

  return savedTaskComment;
}

//Get task comments
export async function getTaskComments(taskId: string) {
  return all(
    `
    SELECT 
      c._id,
      c.taskId,
      c.message,
      c.createdAt,
      c.updatedAt,

      a._id AS author,
      a.firstName,
      a.lastName,
      a.email,
      a.role

    FROM task_comments c
    JOIN admin_users a ON a._id = c.author
    WHERE c.taskId = ?
    ORDER BY c.createdAt ASC
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
    message: r.message,
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
export async function updateTaskComment(
  _id: string,
  message: string,
  updatedAt: string
) {
  await run(
    `
    UPDATE task_comments
    SET message = ?, updatedAt = ?
    WHERE _id = ?
    `,
    [message, updatedAt, _id]
  );
}

//Delete comments
export async function deleteTaskComment(_id: string) {
  await run(
    `
    DELETE FROM task_comments
    WHERE _id = ?
    `,
    [_id]
  );
}
