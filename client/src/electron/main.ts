import "dotenv/config";
import { BrowserWindow, app } from "electron";
import path from "path";
import { getPreloadPath } from "./pathResolver.js";
import { createSocket } from "./socket.js";
import { isDev } from "./util/env.util.js";
import { initializeDatabase } from "./database/initializeDatabase.js";
import { registerAdminUsersIPC } from "./ipc/admin_users.ipc.js";
import { registerEmployeeIPC } from "./ipc/employees.ipc.js";
import { registerAttendanceIPC } from "./ipc/attendances.ipc.js";
import { registerLeaveIPC } from "./ipc/leaves.ipc.js";
import { registerTaskIPC } from "./ipc/tasks.ipc.js";
import { registerTaskCommentIPC } from "./ipc/tasks_comments.ipc.js";
import { registerOfflineUsersIPC } from "./ipc/offline_users.ipc.js";
import { registerAuthIPC } from "./ipc/auth.ipc.js";
import { registerAttendanceExportIPC } from "./ipc/attendances_export.ipc.js";
import { registerSyncIPC } from "./ipc/sync.ipc.js";
import { registerEmployeeDocumentIPC } from "./ipc/employees_documents.ipc.js";
import { fileURLToPath } from "url";
import sync from "./services/sync.service.js";
import { registerAppIPC } from "./ipc/app.ipc.js";
import { markEmployeesOnLeave } from "./services/markEmployeesOnLeave.service.js";
import { ensureStorageDirectories } from "./storage/directories.js";

const environment = isDev() ? "Development" : "Production";

console.log("MAIN STARTED");

console.log("ENVIRONMENT:", environment);

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
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
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
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
  registerEmployeeDocumentIPC();
  registerAttendanceIPC();
  registerAttendanceExportIPC();
  registerLeaveIPC();
  registerTaskIPC();
  registerTaskCommentIPC();
  registerAdminUsersIPC();
  registerSyncIPC();
  registerAppIPC();
  console.log("After IPC registration");
  await ensureStorageDirectories();
  await createSplashWindow();
  await createMainWindow();
  await sync();
  // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Menu.setApplicationMenu(mainMenu);
  // Create CONGE attendances for today's approved leaves
  await markEmployeesOnLeave();
}

bootstrap().catch((error) => {
  console.error("Startup error:", error);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:");
  console.error(err);
});
