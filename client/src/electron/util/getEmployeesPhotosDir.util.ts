import { app } from "electron";
import fs from "fs";
import path from "path";

export function getEmployeesPhotosDir() {
  const userData = app.getPath("userData");
  const photosDir = path.join(userData, "employees_photos");

  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }

  console.log("EMPLOYEES PHOTO DIRECTORY:", photosDir);
  return photosDir;
}
