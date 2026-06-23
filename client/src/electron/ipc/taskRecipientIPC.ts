import { ipcMain } from "electron";
import { getAllTaskRecipients } from "../database/repositories/taskRecipients.repository.js";

export function registerTaskRecipientIPC() {
  console.log("REGISTERING TASK RECIPIENT IPC");
  ipcMain.handle("taskRecipients:getAll", async () => {
    try {
      const taskRecipients = await getAllTaskRecipients();
      console.log("Retrieved task recipients:", taskRecipients);
      return taskRecipients;
    } catch (error) {
      console.error("An error occured while retrieving task recipients", error);
      return;
    }
  });
}
