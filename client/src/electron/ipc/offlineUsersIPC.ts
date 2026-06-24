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
import OfflineUser from "../../shared/types/OfflineUser.js";

export function registerOfflineUsersIPC() {
  console.log("REGISTERING OFFLINE USERS IPC");

  ipcMain.handle("offline-users:save", async (_, user: OfflineUser) => {
    const passwordHash = await bcrypt.hash(user.passwordHash, 12);

    return createOrUpdateOfflineUser({
      _id: user._id,
      email: user.email,
      passwordHash,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastVerifiedAt: new Date().toISOString(),
    });
  });

  ipcMain.handle("offline-users:login", async (_, credentials) => {
    const user = await getOfflineUserByEmail(credentials.email);

    if (!user) {
      throw new Error("No offline account found.");
    }

    const valid = await bcrypt.compare(credentials.password, user.passwordHash);

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
