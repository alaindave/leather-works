import { ipcMain } from "electron";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function adminIPC() {
  console.log("REGISTERING ADMIN IPC");
  ipcMain.handle("admin:getAll", async () => {
    try {
      const admins = await axios.get(`${API_URL}/adminUsers`);
      console.log("Retrieved admins:", admins);
      return admins;
    } catch (error) {
      console.error("An error occured while retrieving Admins", error);
      return;
    }
  });
}
