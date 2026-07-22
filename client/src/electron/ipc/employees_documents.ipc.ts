import { ipcMain, shell, dialog } from "electron";
import fs from "fs/promises";
import {
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
import {
  EmployeeDocument,
  EmployeeDocumentType,
} from "../../shared/types/EmployeeDocuments.js";

export function registerEmployeeDocumentIPC() {
  console.log("REGISTERING EMPLOYEES DOCUMENTS IPC");
  //View document
  ipcMain.handle("employee_documents:view", async (_, localPath: string) => {
    await shell.openPath(localPath);
  });

  //Download document
  ipcMain.handle(
    "employee_documents:download",
    async (_, document: EmployeeDocument) => {
      const result = await dialog.showSaveDialog({
        defaultPath: document.originalName,
      });

      if (result.canceled || !result.filePath) return false;

      await fs.copyFile(document.localPath, result.filePath);

      return true;
    }
  );

  // Upload document
  ipcMain.handle("employees-documents:upload", async (_, document) => {
    return await uploadEmployeeDocument(document);
  });

  //  Update document
  ipcMain.handle("employees-documents:update", async (_, document) => {
    return await updateEmployeeDocument(document);
  });

  // Delete
  ipcMain.handle("employee_documents:delete", async (_, _id: string) => {
    const document = await getEmployeeDocumentById(_id);
    if (!document) return false;
    try {
      await fs.unlink(document.localPath);
    } catch {
      // ignore if already removed
    }
    await deleteEmployeeDocument(_id);
    return true;
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
