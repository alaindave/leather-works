import axios from "axios";
import "dotenv/config";
import { BrowserWindow, app, dialog, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { clearToken, getToken, saveToken } from "./auth.cjs";
import { getPreloadPath } from "./pathResolver.cjs";
import { createSocket } from "./socket.cjs";
import { isDev } from "./util/env-util.cjs";
import { initializeDatabase } from "./database/initializeDatabase.cjs";
import { registerEmployeeIPC } from "./ipc/employeeIPC.cjs";
import { registerAttendanceIPC } from "./ipc/attendanceIPC.cjs";

console.log("MAIN STARTED");
const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;

console.log("API URL:", API_URL);

//Create main and splash windows
let mainWindow: BrowserWindow;
let splash: BrowserWindow;
let splashStartTime = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createSplashWindow = () => {
  splash = new BrowserWindow({
    width: 780,
    height: 580,
    center: true,
    show: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    backgroundColor: "#020817",
  });

  const splashPath = isDev()
    ? path.join(process.cwd(), "src/electron/splash.html")
    : path.join(__dirname, "../../dist/splash.html");
  splash.loadFile(splashPath);

  splash.once("ready-to-show", () => {
    splash.show();
  });

  splashStartTime = Date.now();
};

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1500,
    show: false,
    backgroundColor: "#0f172a",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: getPreloadPath(),
    },
  });
  await createSocket(mainWindow);

  mainWindow.webContents.once("did-finish-load", async () => {
    if (splash && !splash.isDestroyed()) {
      // minimum splash display time
      const elapsed = Date.now() - splashStartTime;
      const minimumSplashTime = 4000;

      if (elapsed < minimumSplashTime) {
        await delay(minimumSplashTime - elapsed);
      }

      // trigger fade-out animation
      splash.webContents.executeJavaScript(`
          document.body.classList.add("fade-out");
        `);

      // wait for animation to finish
      await delay(500);
      splash.close();
    }
    mainWindow.show();
  });

  console.log("Is it development?: ", isDev());

  if (isDev()) {
    await mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }
};

async function bootstrap() {
  await app.whenReady();
  console.log("Before DB init");
  await initializeDatabase();
  console.log("After DB init");
  registerEmployeeIPC();
  registerAttendanceIPC();
  console.log("After IPC registration");
  createSplashWindow();
  await createMainWindow();
  // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Menu.setApplicationMenu(mainMenu);
}

bootstrap().catch((error) => {
  console.error("Startup error:", error);
});

app.disableHardwareAcceleration();

// // Create menu template
// const mainMenuTemplate = [
//   {
//     label: "Fichier",
//     submenu: [
//       {
//         label: "Quitter",
//         click: () => app.quit(),
//         accelerator: "CmdOrCtrl+w",
//       },
//     ],
//   },
// ];

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//Attendance file export
ipcMain.handle("save-file", async (_, fileContent) => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Enregistrer le rapport de présence",
    defaultPath: `rapport-présence-${new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}`,
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "JSON Files", extensions: ["json"] },
      { name: "CSV Files", extensions: ["csv"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!filePath) return { success: false };

  fs.writeFileSync(filePath, fileContent);
  return { success: true, filePath };
});

//Login handler
ipcMain.handle("auth:login", async (_, credentials) => {
  console.log("LOGIN IPC RECEIVED", credentials);
  if (!credentials) {
    throw new Error("Missing credentials");
  }
  const { email, password } = credentials;
  try {
    const res = await axios.post(`${API_URL}/auth`, { email, password });
    await saveToken(res.headers["x-auth-token"]);
    console.log("LOGIN RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("Main process error while logging in:", error);
    throw error;
  }
});

//Logout handler
ipcMain.handle("auth:logout", async () => {
  console.log("LOGOUT IPC RECEIVED");
  try {
    await clearToken();
    return true;
  } catch (error) {
    console.error("Main process error while logging out", error);
    throw error;
  }
});

//Announcement post handler
ipcMain.handle("announcements:create", async (_, announcement) => {
  console.log("Announcement received from Renderer: ", announcement);
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await axios.post(`${API_URL}/announcements`, announcement, {
      headers: {
        "x-auth-token": token,
      },
    });
    console.log("From Main: Announcement saved: ", res.data);
    return res.data;
  } catch (error) {
    console.error("From Main: Error creating announcement: ", error);
    throw error;
  }
});

//Get announcements
ipcMain.handle("announcements:get", async () => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await axios.get(`${API_URL}/announcements`, {
      headers: {
        "x-auth-token": token,
      },
    });

    console.log("From main: Announcements fetched: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
});
