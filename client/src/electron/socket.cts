import { io, Socket } from "socket.io-client";
import { saveToken, getToken, clearToken } from "./auth.cjs";
import { BrowserWindow } from "electron";
import { Announcement } from "../types/Announcement.js";

let socket: Socket | null = null;

export async function createSocket(
  mainWindow: BrowserWindow
): Promise<Socket | null> {
  try {
    const token = await getToken();

    if (!token) {
      console.warn("No auth token found for socket connection");
      return null;
    }

    socket = io("http://localhost:5000", {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Announcements event
    socket.on("new-announcement", (data: Announcement) => {
      console.log("Announcement received:", data);
      mainWindow.webContents.send("announcement:new", data);
    });

    return socket;
  } catch (error) {
    console.error("Socket initialization error:", error);
    return null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}
