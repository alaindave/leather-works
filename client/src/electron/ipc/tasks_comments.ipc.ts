import { ipcMain } from "electron";
import {
  createTaskComment,
  deleteTaskComment,
  getTaskCommentsWithAuthor,
} from "../database/repositories/tasks_comments.repository.js";

export function registerTaskCommentIPC() {
  ipcMain.handle("task-comments:create", async (_event, payload) => {
    return await createTaskComment(payload);
  });

  ipcMain.handle("task-comments:get", async (_event, taskId: string) => {
    return await getTaskCommentsWithAuthor(taskId);
  });

  ipcMain.handle("task-comments:delete", async (_event, commentId: string) => {
    return await deleteTaskComment(commentId);
  });
}
