import { ipcMain, app } from "electron";
import { NetworkService } from "../services/sync/network.service.js";
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
    const online = await NetworkService.canReachBackend();

    if (!online) {
      return {
        success: false,
        message: "Backend unreachable",
      };
    }

    const { email, password } = credentials;
    try {
      const res = await axios.post(`${API_URL}/auth`, { email, password });
      await saveToken(res.headers["x-auth-token"]);
      console.log("ONLINE LOGIN:", res.data);
      return res.data;
    } catch (error) {
      console.error("ERROR OCCURED DURING ONLINE LOGIN:", error);
      throw error;
    }
  });

  //Logout handler
  ipcMain.handle("auth:logout", async () => {
    console.log("SIGN UP IPC RECEIVED");
    try {
      await clearToken();
      return true;
    } catch (error) {
      console.error("ERROR OCCURED DURING LOGOUT", error);
      throw error;
    }
  });

  ipcMain.handle("auth:signup", async (_, credentials) => {
    console.log("SIGN UP IPC RECEIVED");
    if (!credentials) {
      throw new Error("MISSING CREDENTIALS");
    }
    const online = await NetworkService.canReachBackend();

    if (!online) {
      return {
        success: false,
        message: "Backend unreachable",
      };
    }

    const { firstName, lastName, email, password } = credentials;
    try {
      const res = await axios.post(`${API_URL}/adminUsers`, {
        firstName,
        lastName,
        email,
        password,
      });
      await saveToken(res.headers["x-auth-token"]);
      console.log("USER SIGN UP:", res.data);
      return res.data;
    } catch (error) {
      console.error("ERROR OCCURED DURING SIGNUP:", error);
      throw error;
    }
  });
}
