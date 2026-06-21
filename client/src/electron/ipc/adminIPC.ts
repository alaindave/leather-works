import { ipcMain } from "electron";
import axios from "axios";
const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

export function registerAdminIPC() {
  console.log("REGISTERING ADMIN IPC");
  ipcMain.handle("admin:getAll", async () => {
    try {
      const admins = await axios.get(`${API_URL}/adminUsers`);
      console.log("Retrieved admins:", admins.data);
      return admins.data;
    } catch (error) {
      console.error("An error occured while retrieving Admins", error);
      return;
    }
  });
}
