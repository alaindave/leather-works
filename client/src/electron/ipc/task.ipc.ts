import { ipcMain, app } from "electron";
import {
  createTask,
  updateTask,
  getAllTasks,
} from "../database/repositories/task.repository.js";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export function registerTaskIPC() {
  console.log("REGISTERING TASKS IPC");
  console.log("TASKS API URL:", API_URL);

  //Create tasks
  ipcMain.handle("tasks:create", async (_, task) => {
    console.log("TASK CREATE CALLED: ", task);
    try {
      const result = await createTask(task);
      console.log("Created task: ", result);
      return result;
    } catch (error) {
      console.error("From Main: Error creating task: ", error);
      throw error;
    }
  });

  //Update tasks
  ipcMain.handle("tasks:update", async (_, task) => {
    console.log("TASK UPDATE CALLED: ", task);
    try {
      const result = await updateTask(task);
      console.log("Updated task: ", result);
      return result;
    } catch (error) {
      console.error("From Main: Error updating task: ", error);
      throw error;
    }
  });

  //Get all tasks
  ipcMain.handle("tasks:getAll", async () => {
    try {
      const tasks = await getAllTasks();
      console.log("From main: Tasks fetched: ", tasks);
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  });
}
