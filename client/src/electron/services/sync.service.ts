import axios from "axios";
import { app } from "electron";
import { pushPendingChanges } from "./push.service.js";
import { pullLatestChanges } from "./pull.service.js";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

let syncing = false;

export default async function sync() {
  console.log("SYNC SERVICE API URL:", API_URL);
  if (syncing) return;
  syncing = true;
  try {
    try {
      const result = await axios.get(`${API_URL}/health`);
      console.log("BACKEND AVAILABLE: ", result.status);
    } catch (error) {
      console.error("BACKEND UNAVAILABLE: ", error);
      return;
    }
    // PUSH
    try {
      const result = await pushPendingChanges();
      if (result) {
        console.log("PUSH RESULTS: ", result.status);
      }
      console.log("NO ITEMS TO PUSH");
    } catch (error) {
      console.error("PUSH FAILED:", error);
    }

    // PULL
    try {
      const result = await pullLatestChanges();
      console.log("PULL RESULTS: ", result.status);
    } catch (error) {
      console.error("PULL FAILED:", error);
    }
  } catch (error) {
    console.error("PUSH/PULL SYNC FAILED:", error);
  } finally {
    syncing = false;
  }
}
