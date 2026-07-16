import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { app } from "electron";
import { EMPLOYEE_PHOTO_DIR } from "../storage/directories.js";

export async function downloadEmployeePhoto(
  employeeId: string,
  photoFilename: string
) {
  const API_URL = app.isPackaged
    ? "https://leather-works.onrender.com"
    : process.env.VITE_API_URL;

  console.log("URL LOG:", `${API_URL}/photos/${employeeId}`);

  const filePath = path.join(EMPLOYEE_PHOTO_DIR, photoFilename);

  const response = await axios.get(`${API_URL}/photos/${employeeId}`, {
    responseType: "arraybuffer",
  });

  await fs.writeFile(filePath, Buffer.from(response.data));
}
