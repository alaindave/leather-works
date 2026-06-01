import { io, Socket } from "socket.io-client";
import { saveToken, getToken, clearToken } from "./auth.cjs";
import { BrowserWindow } from "electron";
import { Announcement } from "../shared/types/Announcement";

let socket: Socket | null = null;

const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

export async function createSocket(
  mainWindow: BrowserWindow
): Promise<Socket | null> {
  try {
    const token = await getToken();

    if (!token) {
      console.warn("No auth token found for socket connection");
      return null;
    }

    socket = io(`${API_URL}`, {
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
      console.log("Live Announcement received from server:", data);
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
