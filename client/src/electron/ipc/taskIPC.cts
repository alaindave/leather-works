import { ipcMain, app } from "electron";
import { getToken } from "../auth.cjs";
import axios from "axios";

const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;
console.log("API URL:", API_URL);

export function registerAuthIPC() {
  //Task post handler
  ipcMain.handle("tasks:create", async (_, task) => {
    console.log("Task received from Renderer: ", task);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No auth token found");
      }

      const res = await axios.post(`${API_URL}/tasks`, task, {
        headers: {
          "x-auth-token": token,
        },
      });
      console.log("From Main: Task sent: ", res.data);
      return res.data;
    } catch (error) {
      console.error("From Main: Error creating task: ", error);
      throw error;
    }
  });

  // //Get announcements
  ipcMain.handle("tasks:get", async () => {
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
