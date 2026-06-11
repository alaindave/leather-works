const { contextBridge, ipcRenderer } = require("electron");
import type Employee from "../shared/types/Employee";

console.log("PRELOAD LOADED!!!");
console.log("EMPLOYEES API EXPOSED!!!");

contextBridge.exposeInMainWorld("electron", {
  file: { save: (data: string) => ipcRenderer.invoke("save-file", data) },
  auth: {
    login: (credentials: any) => ipcRenderer.invoke("auth:login", credentials),
    logout: () => ipcRenderer.invoke("auth:logout"),
  },

  announcements: {
    createAnnouncement: (data: string) =>
      ipcRenderer.invoke("announcements:create", data),

    getAnnouncements: () => ipcRenderer.invoke("announcements:get"),

    onNew: (callback: (data: any) => void) => {
      const handler = (_: any, data: any) => {
        callback(data);
      };

      ipcRenderer.on("announcement:new", handler);

      return () => {
        ipcRenderer.removeListener("announcement:new", handler);
      };
    },
  },

  employees: {
    create: (employee: Partial<Employee>) =>
      ipcRenderer.invoke("employees:create", employee),

    getAll: () => ipcRenderer.invoke("employees:getAll"),

    getById: (_id: string) => ipcRenderer.invoke("employees:getById", _id),

    update: (_id: string, data: Partial<Employee>) =>
      ipcRenderer.invoke("employees:update", _id, data),

    delete: (_id: string) => ipcRenderer.invoke("employees:delete", _id),

    search: (searchTerm: string) =>
      ipcRenderer.invoke("employees:search", searchTerm),
  },
}) satisfies Window["electron"];
