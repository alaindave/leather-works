import axios from "axios";
import { app } from "electron";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export class NetworkService {
  static async canReachBackend(): Promise<boolean> {
    try {
      await axios.get(`${API_URL}/health`, {
        timeout: 3000,
      });
      console.log("BACKEND AVAILABLE");
      return true;
    } catch {
      console.log("BACKEND UNAVAILABLE");
      return false;
    }
  }
}
