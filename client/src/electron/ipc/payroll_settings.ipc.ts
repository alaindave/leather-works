import { ipcMain } from "electron";

import {
  getPayrollSettings,
  getPayrollSettingsById,
  createPayrollSettings,
  updatePayrollSettings,
  updatePayrollSettingsFields,
  deletePayrollSettings,
  restorePayrollSettings,
  markPayrollSettingsSynced,
  getUnsyncedPayrollSettings,
} from "../database/repositories/payroll_settings.repository.js";

export function registerPayrollSettingsIPC() {
  console.log("REGISTERING PAYROLL SETTINGS IPC");

  ipcMain.handle("payroll-settings:get", async () => {
    return await getPayrollSettings();
  });

  ipcMain.handle("payroll-settings:getById", async (_, _id: string) => {
    return await getPayrollSettingsById(_id);
  });
  ipcMain.handle("payroll-settings:create", async (_, data) => {
    return await createPayrollSettings(data);
  });

  ipcMain.handle("payroll-settings:update", async (_, settings) => {
    return await updatePayrollSettings(settings);
  });

  ipcMain.handle(
    "payroll-settings:updateFields",
    async (_, _id: string, fields) => {
      return await updatePayrollSettingsFields(_id, fields);
    }
  );

  ipcMain.handle("payroll-settings:delete", async (_, _id: string) => {
    await deletePayrollSettings(_id);

    return {
      success: true,
    };
  });

  ipcMain.handle("payroll-settings:restore", async (_, _id: string) => {
    return await restorePayrollSettings(_id);
  });

  ipcMain.handle("payroll-settings:markSynced", async (_, _id: string) => {
    await markPayrollSettingsSynced(_id);

    return {
      success: true,
    };
  });

  ipcMain.handle("payroll-settings:getUnsynced", async () => {
    return await getUnsyncedPayrollSettings();
  });
}
