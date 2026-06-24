import { ipcMain, app } from "electron";
import { getToken } from "../auth.js";
import axios from "axios";
import { createTask } from "../database/repositories/task.repository.js";

const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;
console.log("API URL:", API_URL);

export function registerTaskIPC() {
  console.log("REGISTERING TASKS IPC");
  //Create tasks
  ipcMain.handle("tasks:create", async (_, task) => {
    console.log("Task received from Renderer: ", task);
    try {
      const result = await createTask(task);
      console.log("Created task: ", result);
      return result;
    } catch (error) {
      console.error("From Main: Error creating task: ", error);
      throw error;
    }
  });

  //Get tasks
  ipcMain.handle("tasks:getAll", async () => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("No auth token found");
      }

      const res = await axios.get(`${API_URL}/tasks`, {
        headers: {
          "x-auth-token": token,
        },
      });

      console.log("From main: Tasks fetched: ", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  });
}
