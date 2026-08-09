import { ipcMain } from "electron";
import { calculatePayrollsWithSummary } from "../services/payroll/calculatePayroll.js";
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
  getEmployeePayrollResults,
  cancelPayrollRun,
  verifyPayrollRun,
  approvePayrollRun,
  paymentPayrollRun,
} from "../database/repositories/payroll_run.repository.js";
import User from "../../common/types/User.js";
import AdminUser from "../../common/types/AdminUser.js";
import { validatePayrolls } from "../services/payroll/validatePayroll.js";

export function registerPayrollGenerationIPC() {
  console.log("REGISTERING PAYROLL GENERATION IPC");

  // Generate payroll draft
  ipcMain.handle(
    "payroll:createDraft",
    async (_, admin: Omit<User, "password" | "notes">) => {
      const inputs = await getAllEmployeePayrollInputs();
      console.log("FTECHED PAYROLL INPUTS");
      const validation = validatePayrolls(inputs);
      if (!validation.valid) {
        throw new Error(validation.message);
      }
      const batch = calculatePayrollsWithSummary(inputs, admin);
      const payrollRun = await createPayrollRun(batch, admin);
      await savePayrollResults(payrollRun._id, batch.results);

      return {
        payrollRun,
        results: batch.results,
      };
    }
  );

  /**
   * BROUILLON → EN_VERIFICATION
   */
  ipcMain.handle(
    "payroll:submitForVerification",
    async (_, payrollRunId: string, admin: AdminUser) => {
      return await verifyPayrollRun(payrollRunId, admin);
    }
  );

  /**
   * EN_VERIFICATION → BROUILLON
   * Reviewer sends payroll back for correction
   */
  ipcMain.handle("payroll:returnToDraft", async (_, payrollRunId: string) => {
    return await updatePayrollStatus(payrollRunId, "BROUILLON");
  });

  /**
   * EN_VERIFICATION → APPROUVÉ
   */
  ipcMain.handle(
    "payroll:approve",
    async (_, payrollRunId: string, admin: AdminUser) => {
      return await approvePayrollRun(payrollRunId, admin);
    }
  );

  /**
   * APPROUVÉ → PAYÉ
   */
  ipcMain.handle(
    "payroll:markAsPaid",
    async (_, payrollRunId: string, admin: AdminUser) => {
      return await paymentPayrollRun(payrollRunId, admin);
    }
  );

  /**
   * BROUILLON / EN_VERIFICATION / APPROUVÉ → ANNULÉ
   */
  ipcMain.handle(
    "payroll:cancel",
    async (_, payrollRunId: string, admin: AdminUser) => {
      return await cancelPayrollRun(payrollRunId, admin);
    }
  );

  ipcMain.handle("payroll:getRuns", async () => {
    return await getPayrollRuns();
  });

  ipcMain.handle("payroll:getRunById", async (_, id: string) => {
    return await getPayrollRunById(id);
  });

  ipcMain.handle("payroll:getResults", async (_, payrollRunId: string) => {
    return await getPayrollResults(payrollRunId);
  });

  ipcMain.handle(
    "payroll:getEmployeeResults",
    async (_, employeeId: string, payrollRunId?: string) => {
      console.log("EMPLOYEE PAYSLIPS IPC RECEIVED FOR", employeeId);
      const results = await getEmployeePayrollResults(employeeId, payrollRunId);
      console.log("FETCHED RESULTS", results);
      return results;
    }
  );

  ipcMain.handle(
    "payroll:getItems",
    async (_, payrollResultId: string, employeeId?: string) => {
      return await getPayrollItems(payrollResultId, employeeId);
    }
  );

  ipcMain.handle("payroll:deleteRun", async (_, payrollRunId: string) => {
    return await deletePayrollRun(payrollRunId);
  });
}
