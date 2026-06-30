import { ipcMain, app } from "electron";
import { NetworkService } from "../services/network.service.js";
import axios from "axios";
import { clearToken, saveToken } from "../auth.js";
const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export function registerAuthIPC() {
  console.log("REGISTERING AUTH IPC");
  console.log("AUTH API URL:", API_URL);

  //Login handler
  ipcMain.handle("auth:login", async (_, credentials) => {
    console.log("LOGIN IPC RECEIVED");
    if (!credentials) {
      throw new Error("Missing credentials");
    }
    const online = await NetworkService.isOnline();

    if (!online) {
      return {
        success: false,
        message: "No internet connection",
      };
    }

    const { email, password } = credentials;
    try {
      const res = await axios.post(`${API_URL}/auth`, { email, password });
      await saveToken(res.headers["x-auth-token"]);
      console.log("ONLINE LOGIN SUCCESS:", res.data);
      return res.data;
    } catch (error) {
      console.error("ERROR OCCURED DURING ONLINE LOGIN:", error);
      throw error;
    }
  });

  //Logout handler
  ipcMain.handle("auth:logout", async () => {
    console.log("LOGOUT IPC RECEIVED");
    try {
      await clearToken();
      return true;
    } catch (error) {
      console.error("ERROR OCCURED DURING LOGOUT", error);
      throw error;
    }
  });
}
