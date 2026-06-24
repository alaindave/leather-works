import axios from "axios";
import { app } from "electron";
import { pushPendingChanges } from "./pushService.js";
import { pullLatestChanges } from "./pullService.js";

const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;

let syncing = false;

export default async function sync() {
  if (syncing) return;
  syncing = true;
  try {
    try {
      const result = await axios.get(`${API_URL}/health`);
      console.log("Backend available: ", result);
    } catch (error) {
      console.error("Backend unavailable: ", error);
      return;
    }
    // PUSH
    try {
      const result = await pushPendingChanges();
      console.log("Push results: ", result);
    } catch (error) {
      console.error("Push failed:", error);
    }

    // PULL
    try {
      const result = await pullLatestChanges();
      console.log("Pull results: ", result.data);
    } catch (error) {
      console.error("Pull failed:", error);
    }
  } catch (error) {
    console.error("Sync failed completely:", error);
  } finally {
    syncing = false;
  }
}
