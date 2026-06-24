import "dotenv/config";
import { BrowserWindow, app } from "electron";
import path from "path";
import { getPreloadPath } from "./pathResolver.js";
import { createSocket } from "./socket.js";
import { isDev } from "./util/env-util.js";
import { initializeDatabase } from "./database/initializeDatabase.js";
import { registerAdminUsersIPC } from "./ipc/adminUsersIPC.js";
import { registerEmployeeIPC } from "./ipc/employeeIPC.js";
import { registerAttendanceIPC } from "./ipc/attendanceIPC.js";
import { registerLeaveIPC } from "./ipc/leaveIPC.js";
import { registerTaskIPC } from "./ipc/taskIPC.js";
import { registerOfflineUsersIPC } from "./ipc/offlineUsersIPC.js";
import { registerAuthIPC } from "./ipc/authIPC.js";
import { registerAttendanceExportIPC } from "./ipc/attendanceExportIPC.js";
import { registerSyncIPC } from "./ipc/syncIPC.js";
import { fileURLToPath } from "url";
import sync from "./services/syncService.js";

console.log("MAIN STARTED");
const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;
console.log("API URL:", API_URL);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  app.disableHardwareAcceleration();
  await app.whenReady();
  console.log("Before DB init");
  await initializeDatabase();
  console.log("After DB init");
  registerAuthIPC();
  registerOfflineUsersIPC();
  registerEmployeeIPC();
  registerAttendanceIPC();
  registerAttendanceExportIPC();
  registerLeaveIPC();
  registerTaskIPC();
  registerAdminUsersIPC();
  registerSyncIPC();
  console.log("After IPC registration");
  await createSplashWindow();
  await createMainWindow();
  await sync();
  // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Menu.setApplicationMenu(mainMenu);
}

bootstrap().catch((error) => {
  console.error("Startup error:", error);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
