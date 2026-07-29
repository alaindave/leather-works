import { ipcMain } from "electron";
import {
  calculatePayroll,
  validatePayroll,
} from "../../../../shared/payroll/index.js";

ipcMain.handle("payroll:generate", async (_, input) => {
  const validation = validatePayroll(input);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const result = calculatePayroll(input);

  return result;
});
