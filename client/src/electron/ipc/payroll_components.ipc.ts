import { ipcMain } from "electron";

import {
  createPayrollComponent,
  getPayrollComponents,
  getEnabledPayrollComponents,
  getPayrollComponentById,
  updatePayrollComponent,
  deletePayrollComponent,
  enablePayrollComponent,
  disablePayrollComponent,
  upsertPayrollComponent,
  getUnsyncedPayrollComponents,
  markPayrollComponentSynced,
} from "../database/repositories/payroll_components.repository.js";

export function registerPayrollComponentIPC() {
  console.log("REGISTERING PAYROLL COMPONENT IPC");

  //Get all
  ipcMain.handle(
    "payroll-components:getAll",
    async (_, type?: "EARNING" | "DEDUCTION") => {
      return await getPayrollComponents(type);
    }
  );

  //Get enabled
  ipcMain.handle(
    "payroll-components:getEnabled",
    async (_, type?: "EARNING" | "DEDUCTION") => {
      return await getEnabledPayrollComponents(type);
    }
  );

  //Get by ID
  ipcMain.handle("payroll-components:getById", async (_, id: string) => {
    return await getPayrollComponentById(id);
  });

  //Create
  ipcMain.handle("payroll-components:create", async (_, component) => {
    return await createPayrollComponent(component);
  });

  //Update
  ipcMain.handle("payroll-components:update", async (_, component) => {
    await updatePayrollComponent(component);

    return await getPayrollComponentById(component._id);
  });

  //Delete
  ipcMain.handle("payroll-components:delete", async (_, id: string) => {
    await deletePayrollComponent(id);

    return true;
  });

  //Enable
  ipcMain.handle("payroll-components:enable", async (_, id: string) => {
    await enablePayrollComponent(id);

    return await getPayrollComponentById(id);
  });

  //Disable
  ipcMain.handle("payroll-components:disable", async (_, id: string) => {
    await disablePayrollComponent(id);

    return await getPayrollComponentById(id);
  });

  //Upsert
  ipcMain.handle("payroll-components:upsert", async (_, component) => {
    await upsertPayrollComponent(component);

    return await getPayrollComponentById(component._id);
  });

  //Get unsynced
  ipcMain.handle("payroll-components:getUnsynced", async () => {
    return await getUnsyncedPayrollComponents();
  });

  //Mark synced
  ipcMain.handle("payroll-components:markSynced", async (_, id: string) => {
    await markPayrollComponentSynced(id);

    return await getPayrollComponentById(id);
  });
}
