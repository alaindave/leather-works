import { ipcMain, shell, dialog, app } from "electron";
import fs from "fs/promises";
import path from "path";

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
} from "../../common/types/EmployeeDocuments.js";

function resolveEmployeeDocumentPath(localPath: string): string {
  if (!localPath) {
    throw new Error("Employee document path is empty");
  }

  // Already an absolute path
  if (path.isAbsolute(localPath)) {
    return localPath;
  }

  // Normalize separators so this works with paths coming
  // from Windows, macOS, SQLite, or MongoDB.
  const normalizedPath = localPath.replace(/\\/g, "/");

  // Stored path already includes employees_documents
  if (normalizedPath.startsWith("employees_documents/")) {
    return path.join(app.getPath("userData"), ...normalizedPath.split("/"));
  }

  // Stored path is relative to employees_documents
  return path.join(
    app.getPath("userData"),
    "employees_documents",
    ...normalizedPath.split("/")
  );
}

export function registerEmployeeDocumentIPC() {
  console.log("REGISTERING EMPLOYEES DOCUMENTS IPC");

  // View document
  ipcMain.handle("employee_documents:view", async (_, localPath: string) => {
    const absolutePath = resolveEmployeeDocumentPath(localPath);

    console.log("Viewing employee document:");
    console.log("Stored path:", localPath);
    console.log("Absolute path:", absolutePath);

    const error = await shell.openPath(absolutePath);

    if (error) {
      console.error("Failed to open employee document:", error);

      throw new Error(error);
    }

    return true;
  });

  // Download document
  ipcMain.handle(
    "employee_documents:download",
    async (_, document: EmployeeDocument) => {
      const absolutePath = resolveEmployeeDocumentPath(document.localPath);

      console.log("Downloading employee document:");
      console.log("Stored path:", document.localPath);
      console.log("Absolute path:", absolutePath);

      // Verify the local file exists first
      try {
        await fs.access(absolutePath);
      } catch {
        throw new Error(`Employee document does not exist: ${absolutePath}`);
      }

      const result = await dialog.showSaveDialog({
        defaultPath: document.originalName,
      });

      if (result.canceled || !result.filePath) {
        return false;
      }

      await fs.copyFile(absolutePath, result.filePath);

      return true;
    }
  );

  // Upload document
  ipcMain.handle("employees-documents:upload", async (_, document) => {
    return await uploadEmployeeDocument(document);
  });

  // Update document
  ipcMain.handle("employees-documents:update", async (_, document) => {
    return await updateEmployeeDocument(document);
  });

  // Delete
  ipcMain.handle("employee_documents:delete", async (_, _id: string) => {
    const document = await getEmployeeDocumentById(_id);

    if (!document) {
      return false;
    }

    try {
      const absolutePath = resolveEmployeeDocumentPath(document.localPath);

      await fs.unlink(absolutePath);
    } catch {
      // Ignore if the file has already been removed
    }

    await deleteEmployeeDocument(_id);

    return true;
  });

  // Read by ID
  ipcMain.handle("employees-documents:get-by-id", async (_, id: string) => {
    return await getEmployeeDocumentById(id);
  });

  // Get by employee
  ipcMain.handle(
    "employees-documents:get-by-employee",
    async (_, employeeId: string) => {
      return await getEmployeeDocumentsByEmployee(employeeId);
    }
  );

  // Get by type
  ipcMain.handle(
    "employees-documents:get-by-type",
    async (_, employeeId: string, documentType: EmployeeDocumentType) => {
      return await getEmployeeDocumentsByType(employeeId, documentType);
    }
  );

  // Get all
  ipcMain.handle("employees-documents:get-all", async () => {
    return await getAllEmployeeDocuments();
  });

  // Sync
  ipcMain.handle("employees-documents:get-unsynced", async () => {
    return await getUnsyncedEmployeeDocuments();
  });

  // Mark synced
  ipcMain.handle("employees-documents:mark-synced", async (_, id: string) => {
    return await markEmployeeDocumentUploaded(id);
  });
}
