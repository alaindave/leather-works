import { app } from "electron";
import fs from "fs";
import path from "path";

export function getEmployeePhotosDir() {
  const userData = app.getPath("userData");
  const photosDir = path.join(userData, "employee_photos");

  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }

  console.log("EMPLOYEE PHOTO DIRECTORY:", photosDir);
  return photosDir;
}
