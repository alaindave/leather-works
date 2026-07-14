import { ipcMain } from "electron";
import bcrypt from "bcrypt";

import {
  createOrUpdateOfflineUser,
  saveNotes,
  getOfflineUserByEmail,
  getOfflineUserById,
  getAllOfflineUsers,
  deleteOfflineUser,
} from "../database/repositories/offline_users.repository.js";

export function registerOfflineUsersIPC() {
  console.log("REGISTERING OFFLINE USERS IPC");

  ipcMain.handle("offline-users:save", async (_, user) => {
    try {
      if (!user.password) {
        throw new Error("Password missing");
      }
      const password = await bcrypt.hash(user.password, 12);
      const offline_user = await createOrUpdateOfflineUser({
        _id: user._id,
        email: user.email,
        password,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        notes: user.notes,
        lastVerifiedAt: new Date().toISOString(),
      });
      console.log("OFFLINE USER UPDATED:", offline_user);
      return offline_user;
    } catch (error) {
      console.error("offline-users:save failed", error);
      throw error;
    }
  });

  ipcMain.handle("offline-users:login", async (_, credentials) => {
    const user = await getOfflineUserByEmail(credentials.email);

    if (!user) {
      throw new Error("No offline account found.");
    }

    const valid = await bcrypt.compare(credentials.password, user.password);

    if (!valid) {
      throw new Error("Invalid credentials.");
    }

    return user;
  });

  ipcMain.handle(
    "offline-users:saveNotes",
    async (_, _id: string, notes: string) => {
      return saveNotes(_id, notes);
    }
  );

  ipcMain.handle("offline-users:getById", async (_, _id: string) => {
    return getOfflineUserById(_id);
  });

  ipcMain.handle("offline-users:getByEmail", async (_, email: string) => {
    return getOfflineUserByEmail(email);
  });

  ipcMain.handle("offline-users:getAll", async () => {
    return getAllOfflineUsers();
  });

  ipcMain.handle("offline-users:delete", async (_, _id: string) => {
    await deleteOfflineUser(_id);
    return true;
  });
}
