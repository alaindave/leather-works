import { ipcMain } from "electron";
import bcrypt from "bcrypt";

import {
  createOrUpdateOfflineUser,
  getOfflineUserByEmail,
  getOfflineUserById,
  getAllOfflineUsers,
  deleteOfflineUser,
} from "../../electron/database/repositories/offline_users.repository.cjs";

export function registerOfflineUsersIPC() {
  console.log("REGISTERING OFFLINE USERS IPC");

  ipcMain.handle("offline-users:save", async (_, user) => {
    const passwordHash = await bcrypt.hash(user.password, 12);

    return createOrUpdateOfflineUser({
      _id: user._id,
      email: user.email,
      passwordHash,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
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
