import "dotenv/config";
import { BrowserWindow, app } from "electron";
import path from "path";
import { getPreloadPath } from "./pathResolver.cjs";
import { createSocket } from "./socket.cjs";
import { isDev } from "./util/env-util.cjs";
import { initializeDatabase } from "./database/initializeDatabase.cjs";
import { registerEmployeeIPC } from "./ipc/employeeIPC.cjs";
import { registerAttendanceIPC } from "./ipc/attendanceIPC.cjs";
import { registerLeaveIPC } from "./ipc/leaveIPC.cjs";
import { registerOfflineUsersIPC } from "./ipc/offlineUsersIPC.cjs";
import { registerAuthIPC } from "./ipc/authIPC.cjs";
import { registerAttendanceExportIPC } from "./ipc/attendanceExportIPC.cjs";
import { registerSyncIPC } from "./ipc/syncIPC.cjs";

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
  registerSyncIPC();
  console.log("After IPC registration");
  createSplashWindow();
  await createMainWindow();
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
