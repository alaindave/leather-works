import axios from "axios";
import { app } from "electron";
import fs from "fs/promises";
import path from "path";
import { EMPLOYEE_DOCUMENTS_DIR } from "../storage/directories.js";
import Employee from "../../shared/types/Employee.js";
import { EmployeeDocument } from "../../shared/types/EmployeeDocuments.js";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export async function downloadEmployeeDocument(
  employee: Employee,
  document: EmployeeDocument
): Promise<string> {
  const url = `${API_URL}/documents/${document._id}`;

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  if (!employee) {
    throw new Error(`Employee ${document.employeeId} not found`);
  }

  const employeeFolderName =
    `${employee.firstName}_${employee.lastName}_${employee._id}`
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_");

  const documentFolder = path.join(
    EMPLOYEE_DOCUMENTS_DIR,
    employeeFolderName,
    document.documentType
  );

  await fs.mkdir(documentFolder, {
    recursive: true,
  });

  const localPath = path.join(documentFolder, document.fileName);

  await fs.writeFile(localPath, Buffer.from(response.data));

  return localPath;
}
