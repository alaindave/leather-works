import { IpcMainInvokeEvent, ipcMain } from "electron";
import EmployeePayrollProfile from "../../shared/types/payroll/PayrollEmployeeProfile.js";
import {
  createEmployeePayrollProfile,
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
  createManyEmployeePayrollProfiles,
} from "../database/repositories/payrollEmployeeProfile.repository.js";

import {
  initializeEmployeePayrollProfiles,
  initializeEmployeePayrollProfilesForEmployee,
  addPayrollComponentToAllEmployees,
  resetEmployeePayrollProfileToDefaults,
} from "../services/payrollProfile.service.js";
import CreatePayrollProfileDto from "../../shared/types/payroll/CreatePayrollProfileDto.js";

/* -------------------------------------------------------------------------- */
/*                                    Repository                                 */
/* -------------------------------------------------------------------------- */
export function registerPayrollEmployeeProfileIPC() {
  console.log("REGISTERING PAYROLL EMPLOYEE PROFILE IPC");
  ipcMain.handle(
    "payrollEmployeeProfiles:create",
    async (
      _: IpcMainInvokeEvent,
      employeeID: string,
      profile: CreatePayrollProfileDto
    ) => {
      return await createEmployeePayrollProfile(employeeID, profile);
    }
  );

  ipcMain.handle(
    "payrollEmployeeProfiles:createMany",
    async (
      _: IpcMainInvokeEvent,
      employeeID: string,
      profiles: CreatePayrollProfileDto[]
    ) => {
      return await createManyEmployeePayrollProfiles(employeeID, profiles);
    }
  );

  ipcMain.handle(
    "payrollEmployeeProfiles:update",
    async (_: IpcMainInvokeEvent, profiles: EmployeePayrollProfile[]) => {
      return await updateManyEmployeePayrollProfiles(profiles);
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

  //Get all
  ipcMain.handle(
    "payrollEmployeeProfiles:getAll",
    async (_, employeeID?: string, type?: "EARNING" | "DEDUCTION") => {
      return await getAllEmployeePayrollProfiles(employeeID, type);
    }
  );

  ipcMain.handle(
    "payrollEmployeeProfiles:getByEmployee",
    async (_: IpcMainInvokeEvent, employeeId: string) => {
      return await getEmployeePayrollProfilesByEmployee(employeeId);
    }
  );

  ipcMain.handle(
    "payrollEmployeeProfiles:getByComponent",
    async (_: IpcMainInvokeEvent, employeeId: string, componentId: string) => {
      return await getEmployeePayrollProfileByComponent(
        employeeId,
        componentId
      );
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
}
