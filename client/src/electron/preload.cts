const { contextBridge, ipcRenderer } = require("electron");
import type Employee from "../shared/types/Employee";

console.log(" Preload loaded!");

contextBridge.exposeInMainWorld("electron", {
  file: { save: (data: string) => ipcRenderer.invoke("save-file", data) },
  auth: {
    login: (credentials: any) => ipcRenderer.invoke("auth:login", credentials),
    logout: () => ipcRenderer.invoke("auth:logout"),
  },

  announcements: {
    createAnnouncement: (data: any) =>
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
    getAll: (): Promise<Employee[]> => ipcRenderer.invoke("employees:getAll"),

    getById: (_id: string): Promise<Employee> =>
      ipcRenderer.invoke("employees:getById", _id),

    create: (data: Partial<Employee>): Promise<Employee> =>
      ipcRenderer.invoke("employees:create", data),

    update: (_id: string, data: Partial<Employee>): Promise<Employee> =>
      ipcRenderer.invoke("employees:update", { _id, data }),

    delete: (_id: string): Promise<void> =>
      ipcRenderer.invoke("employees:delete", _id),
  },
});
