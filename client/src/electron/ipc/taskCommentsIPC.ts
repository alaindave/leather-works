import { ipcMain } from "electron";
import {
  createTaskComment,
  getTaskComments,
  deleteTaskComment,
} from "../database/repositories/tasks_comments.repository.js";

ipcMain.handle("task-comments:create", async (_event, payload) => {
  return await createTaskComment(payload);
});

ipcMain.handle("task-comments:get", async (_event, taskId: string) => {
  return await getTaskComments(taskId);
});

ipcMain.handle("task-comments:delete", async (_event, commentId: string) => {
  return await deleteTaskComment(commentId);
});
