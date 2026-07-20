import { ipcMain } from "electron";

import {
  createEmployeeDocument,
  upsertEmployeeDocument,
  updateEmployeeDocument,
  deleteEmployeeDocument,
  getEmployeeDocumentById,
  getEmployeeDocumentsByEmployee,
  getEmployeeDocumentsByType,
  getAllEmployeeDocuments,
  getUnsyncedEmployeeDocuments,
  markEmployeeDocumentUploaded,
  uploadEmployeeDocument,
} from "../../electron/database/repositories/employees_documents.repository.js";
import { EmployeeDocumentType } from "../../shared/types/EmployeeDocuments.js";

export function registerEmployeeDocumentIPC() {
  console.log("REGISTERING EMPLOYEES DOCUMENTS IPC");
  // Upload document
  ipcMain.handle("employees-documents:upload", async (_, document) => {
    return await uploadEmployeeDocument(document);
  });

  // Create document
  ipcMain.handle("employees-documents:create", async (_, document) => {
    return await createEmployeeDocument(document);
  });

  //  Upsert document
  ipcMain.handle("employees-documents:upsert", async (_, document) => {
    return await upsertEmployeeDocument(document);
  });

  //  Update document
  ipcMain.handle("employees-documents:update", async (_, document) => {
    return await updateEmployeeDocument(document);
  });

  // Delete
  ipcMain.handle("employees-documents:delete", async (_, id: string) => {
    return await deleteEmployeeDocument(id);
  });

  // Read
  ipcMain.handle("employees-documents:get-by-id", async (_, id: string) => {
    return await getEmployeeDocumentById(id);
  });

  ipcMain.handle(
    "employees-documents:get-by-employee",
    async (_, employeeId: string) => {
      return await getEmployeeDocumentsByEmployee(employeeId);
    }
  );

  ipcMain.handle(
    "employees-documents:get-by-type",
    async (_, employeeId: string, documentType: EmployeeDocumentType) => {
      return await getEmployeeDocumentsByType(employeeId, documentType);
    }
  );

  ipcMain.handle("employees-documents:get-all", async () => {
    return await getAllEmployeeDocuments();
  });

  // Sync
  ipcMain.handle("employees-documents:get-unsynced", async () => {
    return await getUnsyncedEmployeeDocuments();
  });

  ipcMain.handle("employees-documents:mark-synced", async (_, id: string) => {
    return await markEmployeeDocumentUploaded(id);
  });
}
