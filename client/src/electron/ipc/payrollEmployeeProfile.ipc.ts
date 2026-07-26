import { IpcMainInvokeEvent, ipcMain } from "electron";
import EmployeePayrollProfile from "../../shared/types/payroll/PayrollEmployeeProfile.js";

const {
  createEmployeePayrollProfile,
  createManyEmployeePayrollProfiles,
  updateEmployeePayrollProfile,
  updateManyEmployeePayrollProfiles,
  upsertEmployeePayrollProfile,
  upsertManyEmployeePayrollProfiles,
  getEmployeePayrollProfile,
  getEmployeePayrollProfilesByEmployee,
  getEmployeePayrollProfileByComponent,
  getAllEmployeePayrollProfiles,
  getUnsyncedEmployeePayrollProfiles,
  markEmployeePayrollProfileSynced,
  markManyEmployeePayrollProfilesSynced,
  deleteEmployeePayrollProfile,
  restoreEmployeePayrollProfile,
  permanentlyDeleteEmployeePayrollProfile,
  employeePayrollProfileExists,
  countEmployeePayrollProfiles,
} = require("../database/repositories/payrollEmployeeProfile.repository.js");

const {
  initializeEmployeePayrollProfiles,
  initializeEmployeePayrollProfilesForEmployee,
  addPayrollComponentToAllEmployees,
  resetEmployeePayrollProfileToDefaults,
} = require("../services/payrollEmployeeProfile.service.js");

/* -------------------------------------------------------------------------- */
/*                                  Repository                                */
/* -------------------------------------------------------------------------- */

ipcMain.handle(
  "payrollEmployeeProfiles:create",
  async (_: IpcMainInvokeEvent, profile: EmployeePayrollProfile) => {
    return await createEmployeePayrollProfile(profile);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:createMany",
  async (_: IpcMainInvokeEvent, profiles: EmployeePayrollProfile[]) => {
    return await createManyEmployeePayrollProfiles(profiles);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:update",
  async (_: IpcMainInvokeEvent, profile: EmployeePayrollProfile) => {
    return await updateEmployeePayrollProfile(profile);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:updateMany",
  async (_: IpcMainInvokeEvent, profiles: EmployeePayrollProfile[]) => {
    return await updateManyEmployeePayrollProfiles(profiles);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:upsert",
  async (_, profile: EmployeePayrollProfile) => {
    return await upsertEmployeePayrollProfile(profile);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:upsertMany",
  async (_: IpcMainInvokeEvent, profiles: EmployeePayrollProfile[]) => {
    return await upsertManyEmployeePayrollProfiles(profiles);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:get",
  async (_: IpcMainInvokeEvent, _id: string) => {
    return await getEmployeePayrollProfile(_id);
  }
);

ipcMain.handle("payrollEmployeeProfiles:getAll", async () => {
  return await getAllEmployeePayrollProfiles();
});

ipcMain.handle(
  "payrollEmployeeProfiles:getByEmployee",
  async (_: IpcMainInvokeEvent, employeeId: string) => {
    return await getEmployeePayrollProfilesByEmployee(employeeId);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:getByComponent",
  async (_: IpcMainInvokeEvent, employeeId: string, componentId: string) => {
    return await getEmployeePayrollProfileByComponent(employeeId, componentId);
  }
);

ipcMain.handle("payrollEmployeeProfiles:getUnsynced", async () => {
  return await getUnsyncedEmployeePayrollProfiles();
});

ipcMain.handle(
  "payrollEmployeeProfiles:markSynced",
  async (_: IpcMainInvokeEvent, id) => {
    return await markEmployeePayrollProfileSynced(id);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:markManySynced",
  async (_: IpcMainInvokeEvent, ids) => {
    return await markManyEmployeePayrollProfilesSynced(ids);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:delete",
  async (_: IpcMainInvokeEvent, id) => {
    return await deleteEmployeePayrollProfile(id);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:restore",
  async (_: IpcMainInvokeEvent, id) => {
    return await restoreEmployeePayrollProfile(id);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:permanentlyDelete",
  async (_: IpcMainInvokeEvent, id) => {
    return await permanentlyDeleteEmployeePayrollProfile(id);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:exists",
  async (_: IpcMainInvokeEvent, employeeId, componentId) => {
    return await employeePayrollProfileExists(employeeId, componentId);
  }
);

ipcMain.handle("payrollEmployeeProfiles:count", async () => {
  return await countEmployeePayrollProfiles();
});

/* -------------------------------------------------------------------------- */
/*                                    Service                                 */
/* -------------------------------------------------------------------------- */

ipcMain.handle("payrollEmployeeProfiles:initialize", async () => {
  return await initializeEmployeePayrollProfiles();
});

ipcMain.handle(
  "payrollEmployeeProfiles:initializeForEmployee",
  async (_, employeeId) => {
    return await initializeEmployeePayrollProfilesForEmployee(employeeId);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:addComponentToEmployees",
  async (_, component) => {
    return await addPayrollComponentToAllEmployees(component);
  }
);

ipcMain.handle(
  "payrollEmployeeProfiles:resetToDefaults",
  async (_, employeeId) => {
    return await resetEmployeePayrollProfileToDefaults(employeeId);
  }
);
