import { ipcMain } from "electron";
import { getAllAdminUsers } from "../database/repositories/admin_users.repository.js";

export function registerAdminUsersIPC() {
  console.log("REGISTERING ADMIN USERS IPC");
  ipcMain.handle("adminUsers:getAll", async () => {
    try {
      const adminUsers = await getAllAdminUsers();
      console.log("Retrieved admin users:", adminUsers);
      return adminUsers;
    } catch (error) {
      console.error("An error occured while retrieving admin users", error);
      return;
    }
  });
}
