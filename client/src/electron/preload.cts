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

  attendance: {
    create: (employeeId: string, clockIn: string) =>
      ipcRenderer.invoke("attendance:create", employeeId, clockIn),

    getAll: () => ipcRenderer.invoke("attendance:getAll"),

    getById: (_id: string) => ipcRenderer.invoke("attendance:getById", _id),

    getByEmployee: (employeeId: string) =>
      ipcRenderer.invoke("attendance:getByEmployee", employeeId),

    getByDate: (date: string) =>
      ipcRenderer.invoke("attendance:getByDate", date),

    getAttendanceRecord: (employeeId: string, date: string) =>
      ipcRenderer.invoke("attendance:getAttendanceRecord", employeeId, date),

    updateClockIn: (_id: string, clockIn: string) =>
      ipcRenderer.invoke("attendance:updateClockIn", _id, clockIn),

    updateClockOut: (_id: string, clockOut: string) =>
      ipcRenderer.invoke("attendance:updateClockOut", _id, clockOut),

    delete: (_id: string) => ipcRenderer.invoke("attendance:delete", _id),

    clockOut: (_id: string, clockOut: string) =>
      ipcRenderer.invoke("attendance:clockOut", _id, clockOut),
  },
}) satisfies Window["electron"];
