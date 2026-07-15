import path from "path";
import { app } from "electron";
import fs from "fs/promises";

export const EMPLOYEE_PHOTO_DIR = path.join(
  app.getPath("userData"),
  "employees_photos"
);

export const EMPLOYEE_DOCUMENTS_DIR = path.join(
  app.getPath("userData"),
  "employees_documents"
);

export async function ensureStorageDirectories() {
  const folders = [EMPLOYEE_PHOTO_DIR, EMPLOYEE_DOCUMENTS_DIR];

  for (const folder of folders) {
    await fs.mkdir(folder, {
      recursive: true,
    });

    console.log("FOLDER CREATED:", folder);
  }
}
