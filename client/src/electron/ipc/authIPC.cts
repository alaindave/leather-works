import { ipcMain, app } from "electron";
import axios from "axios";
import { clearToken, saveToken } from "../auth.cjs";
const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;

export function registerAuthIPC() {
  console.log("REGISTERING AUTH IPC");

  //Login handler
  ipcMain.handle("auth:login", async (_, credentials) => {
    console.log("LOGIN IPC RECEIVED", credentials);
    if (!credentials) {
      throw new Error("Missing credentials");
    }
    const { email, password } = credentials;
    try {
      const res = await axios.post(`${API_URL}/auth`, { email, password });
      await saveToken(res.headers["x-auth-token"]);
      console.log("LOGIN RESPONSE:", res.data);
      return res.data;
    } catch (error) {
      console.error("Main process error while logging in:", error);
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
      console.error("Main process error while logging out", error);
      throw error;
    }
  });
}
