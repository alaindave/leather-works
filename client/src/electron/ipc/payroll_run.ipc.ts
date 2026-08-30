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
import { getPayrollSettings } from "../database/repositories/payroll_settings.repository.js";
import User from "../../common/types/User.js";
import AdminUser from "../../common/types/AdminUser.js";
import { validatePayrolls } from "../services/payroll/validatePayroll.js";
import { getPayrollAttendanceSummary } from "../database/repositories/attendances.repository.js";

export function registerPayrollGenerationIPC() {
  console.log("REGISTERING PAYROLL GENERATION IPC");

  // Generate payroll draft
  ipcMain.handle(
    "payroll:createDraft",
    async (
      _,
      admin: Omit<User, "password" | "notes">,
      month: number,
      year: number
    ) => {
      // Current payroll period
      // const date = new Date();
      // const month = date.getMonth() + 1;
      // const year = date.getFullYear();

      //  Fetch payroll settings
      const payrollSettings = await getPayrollSettings();
      if (!payrollSettings) {
        throw new Error(
          `Veuillez d'abord configurer les paramètres de bulletins de paie. 
          `
        );
      }
      console.log("PAYROLL SETTINGS:", payrollSettings);

      // Employee payroll inputs
      const inputs = await getAllEmployeePayrollInputs();

      console.log(
        `FETCHED ${inputs.length} EMPLOYEE PAYROLL INPUTS FOR ${month}/${year}`
      );

      // Fetch attendance summary
      const payrollInputsWithAttendance = await Promise.all(
        inputs.map(async (employee) => {
          const attendance = await getPayrollAttendanceSummary(
            employee.employeeId,
            month,
            year
          );
          console.log(`ATTENDANCE FOR ${employee.employeeId}:`, attendance);

          return {
            ...employee,
            attendance,
          };
        })
      );

      // Validate payroll
      const validation = validatePayrolls(payrollInputsWithAttendance);

      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Calculate payroll

      const batch = await calculatePayrollsWithSummary(
        payrollInputsWithAttendance,
        admin,
        payrollSettings
      );

      // Create payroll run
      const payrollRun = await createPayrollRun(batch, admin, month, year);

      // Save payroll results
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
