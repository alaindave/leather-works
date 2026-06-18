const { contextBridge, ipcRenderer } = require("electron");
import OfflineUser from "@shared/types/OfflineUser";
import type Employee from "../shared/types/Employee";

interface LoginCredentials {
  email: string;
  password: string;
}

console.log("PRELOAD LOADED!!!");

contextBridge.exposeInMainWorld("electron", {
  file: { save: (data: string) => ipcRenderer.invoke("save-file", data) },
  auth: {
    login: (credentials: LoginCredentials) =>
      ipcRenderer.invoke("auth:login", credentials),
    logout: () => ipcRenderer.invoke("auth:logout"),
  },

  offlineUsers: {
    save: (user: OfflineUser) => ipcRenderer.invoke("offline-users:save", user),

    login: (credentials: LoginCredentials) =>
      ipcRenderer.invoke("offline-users:login", credentials),

    getById: (_id: string) => ipcRenderer.invoke("offline-users:getById", _id),

    getByEmail: (email: string) =>
      ipcRenderer.invoke("offline-users:getByEmail", email),

    getAll: () => ipcRenderer.invoke("offline-users:getAll"),

    delete: (_id: string) => ipcRenderer.invoke("offline-users:delete", _id),
  },

  tasks: {
    createTasks: (data: string) => ipcRenderer.invoke("tasks:create", data),

    getTasks: () => ipcRenderer.invoke("tasks:get"),

    onNew: (callback: (data: any) => void) => {
      const handler = (_: any, data: any) => {
        callback(data);
      };

      ipcRenderer.on("task:new", handler);

      return () => {
        ipcRenderer.removeListener("task:new", handler);
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

    submitLateNotes: (_id: string, lateNotes: string | undefined) =>
      ipcRenderer.invoke("attendance:submitLateNotes", _id, lateNotes),

    delete: (_id: string) => ipcRenderer.invoke("attendance:delete", _id),

    clockOut: (_id: string, clockOut: string) =>
      ipcRenderer.invoke("attendance:clockOut", _id, clockOut),
  },

  leave: {
    create: (
      employeeId: string,
      startDate: string,
      endDate: string,
      subject: string,
      notes: string
    ) =>
      ipcRenderer.invoke(
        "leave:create",
        employeeId,
        startDate,
        endDate,
        subject,
        notes
      ),
    getLeaveById: (_id: string) =>
      ipcRenderer.invoke("leave:getLeaveById", _id),

    getLeaveByMonth: (month: string) =>
      ipcRenderer.invoke("leave:getLeaveByMonth", month),

    update: (
      _id: string,
      updates: {
        subject?: string;
        notes?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
      }
    ) => ipcRenderer.invoke("leave:update", _id, updates),

    delete: (_id: string) => ipcRenderer.invoke("leave:delete", _id),
  },

  sync: () => ipcRenderer.invoke("sync:run"),
}) satisfies Window["electron"];
