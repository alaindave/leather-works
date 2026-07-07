import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { app } from "electron";
import { getEmployeesPhotosDir } from "./getEmployeesPhotosDir.util.js";

export async function downloadEmployeePhoto(photoFilename: string) {
  const API_URL = app.isPackaged
    ? "https://leather-works.onrender.com"
    : process.env.VITE_API_URL;

  const photoDir = getEmployeesPhotosDir();
  const filePath = path.join(photoDir, photoFilename);

  const response = await axios.get(
    `${API_URL}/employees_photos/${photoFilename}`,
    {
      responseType: "arraybuffer",
    }
  );

  await fs.writeFile(filePath, Buffer.from(response.data));
}
