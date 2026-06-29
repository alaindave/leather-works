import { ipcMain } from "electron";

import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} from "../database/repositories/employee.repository.js";

export function registerEmployeeIPC() {
  console.log("REGISTERING EMPLOYEES IPC");
  ipcMain.handle("employees:create", async (_, employee) => {
    console.log("EMPLOYEE CREATE IPC RECEIVED");
    return createEmployee(employee);
  });

  ipcMain.handle("employees:getAll", async () => {
    return getAllEmployees();
  });

  ipcMain.handle("employees:getById", async (_, _id) => {
    return getEmployeeById(_id);
  });

  ipcMain.handle("employees:update", async (_, _id, employee) => {
    return updateEmployee(_id, employee);
  });

  ipcMain.handle("employees:delete", async (_, _id) => {
    return deleteEmployee(_id);
  });

  ipcMain.handle("employees:search", async (_, searchTerm) => {
    return searchEmployees(searchTerm);
  });
}
