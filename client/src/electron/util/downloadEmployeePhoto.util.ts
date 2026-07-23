import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { app } from "electron";

import { EMPLOYEE_PHOTO_DIR } from "../storage/directories.js";
import { getEmployeeById } from "../database/repositories/employees.repository.js";

export async function downloadEmployeePhoto(
  employeeId: string,
  photoFilename: string
) {
  const API_URL = app.isPackaged
    ? "https://leather-works.onrender.com"
    : process.env.VITE_API_URL;

  const employee = await getEmployeeById(employeeId);

  if (!employee) {
    throw new Error(`Employee ${employeeId} not found`);
  }

  // Filesystem-safe folder name
  const employeeFolderName =
    `${employee.firstName}_${employee.lastName}_${employee._id}`
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_");

  const employeeFolder = path.join(EMPLOYEE_PHOTO_DIR, employeeFolderName);

  await fs.mkdir(employeeFolder, {
    recursive: true,
  });

  const filePath = path.join(employeeFolder, photoFilename);

  console.log("DOWNLOADING PHOTO FROM:", `${API_URL}/photos/${employeeId}`);
  console.log("SAVING PHOTO TO:", filePath);

  const response = await axios.get(`${API_URL}/photos/${employeeId}`, {
    responseType: "arraybuffer",
  });

  await fs.writeFile(filePath, Buffer.from(response.data));

  return filePath;
}
