import { ipcMain, app } from "electron";
import path from "path";
import fs from "fs";

import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} from "../database/repositories/employees.repository.js";
import { uploadEmployeePhoto } from "../database/repositories/employees_photos.repository.js";

export function registerEmployeeIPC() {
  console.log("REGISTERING EMPLOYEES IPC");
  ipcMain.handle("employees:create", async (_, employee) => {
    console.log("EMPLOYEE CREATE IPC RECEIVED");
    return createEmployee(employee);
  });

  ipcMain.handle("employees:uploadPhoto", async (_, employeeId, file) => {
    console.log("EMPLOYEE PHOTO UPLOAD RECEIVED");
    const upload_results = await uploadEmployeePhoto(employeeId, file);
    console.log("UPLOAD RESULTS:", upload_results);
    return upload_results;
  });

  ipcMain.handle("employees:getAll", async () => {
    return getAllEmployees();
  });

  ipcMain.handle("employees:getById", async (_, _id) => {
    return getEmployeeById(_id);
  });

  ipcMain.handle("photos:getUrl", (_, relativePath: string) => {
    const fullPath = path.join(app.getPath("userData"), relativePath);
    const buffer = fs.readFileSync(fullPath);
    return buffer.toString("base64");
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
