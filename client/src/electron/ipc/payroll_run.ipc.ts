import { ipcMain } from "electron";
import {
  calculatePayrolls,
  validatePayrolls,
} from "../../../../shared/dist/payroll_service/index.js";

import { getAllEmployeePayrollInputs } from "../database/repositories/payroll_employee_profile.repository.js";

import {
  createPayrollRun,
  savePayrollResults,
  getPayrollRuns,
  getPayrollRunById,
  updatePayrollStatus,
  getPayrollResults,
  getPayrollItems,
  deletePayrollRun,
} from "../database/repositories/payroll_run.repository.js";
import User from "../../common/types/User.js";

export function registerPayrollGenerationIPC() {
  console.log("REGISTERING PAYROLL GENERATION IPC");

  ipcMain.handle(
    "payroll:createDraft",
    async (
      _,
      month: number,
      year: number,
      admin: Omit<User, "password" | "notes">
    ) => {
      return await createPayrollRun(month, year, admin);
    }
  );

  ipcMain.handle(
    "payroll:process",
    async (
      _,
      month: number,
      year: number,
      admin: Omit<User, "password" | "notes">
    ) => {
      // Get employee payroll configurations
      const inputs = await getAllEmployeePayrollInputs();

      console.log(
        "TESTING EMPLOYEE PAYROLL PROFILES INPUTS",
        JSON.stringify(inputs, null, 2)
      );

      // Validate all employees
      const validation = validatePayrolls(inputs);

      if (!validation.valid) {
        throw new Error(validation.message);
      }

      console.log("ADMIN:", admin);
      // Calculate all employees'payroll
      const results = calculatePayrolls(inputs, admin);

      // Create payroll run
      const payrollRun = await createPayrollRun(month, year, admin);

      //Update payroll status
      await updatePayrollStatus(payrollRun._id, "EN_VERIFICATION");

      // Persist results
      await savePayrollResults(payrollRun._id, results);

      return {
        payrollRun,
        results,
      };
    }
  );

  ipcMain.handle("payroll:getRuns", async () => {
    return await getPayrollRuns();
  });

  ipcMain.handle("payroll:getRunById", async (_, id: string) => {
    return await getPayrollRunById(id);
  });

  ipcMain.handle("payroll:updateStatus", async (_, id: string, status) => {
    return await updatePayrollStatus(id, status);
  });

  ipcMain.handle("payroll:getResults", async (_, payrollRunId: string) => {
    return await getPayrollResults(payrollRunId);
  });

  ipcMain.handle(
    "payroll:getItems",
    async (_, payrollRunId: string, employeeId?: string) => {
      return await getPayrollItems(payrollRunId, employeeId);
    }
  );

  ipcMain.handle("payroll:deleteRun", async (_, payrollRunId: string) => {
    return await deletePayrollRun(payrollRunId);
  });
}
