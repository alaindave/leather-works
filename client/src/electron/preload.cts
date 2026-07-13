const { contextBridge, ipcRenderer } = require("electron");
type OfflineUser = import("../shared/types/OfflineUser", { with: { "resolution-mode": "require" } }).default;
type Employee = import("../shared/types/Employee", { with: { "resolution-mode": "require" } }).default;
type AttendanceWithEmployee = import("../shared/types/AttendanceWithEmployee", { with: { "resolution-mode": "require" } }).default;
type Leave = import("../shared/types/Leave", { with: { "resolution-mode": "require" } }).default;
type Task = import("../shared/types/Task", { with: { "resolution-mode": "require" } }).default;


interface LoginCredentials {
  email: string;
  password: string;
}

console.log("PRELOAD LOADED!!!");

contextBridge.exposeInMainWorld("electron", {
  app: {
  getUserDataPath: () => ipcRenderer.invoke("app:getUserDataPath"),
},
  auth: {
    login: (credentials: LoginCredentials) =>
      ipcRenderer.invoke("auth:login", credentials),
    logout: () => ipcRenderer.invoke("auth:logout"),
  },

  offlineUsers: {
    save: (user: OfflineUser) => ipcRenderer.invoke("offline-users:save", user),

    saveNotes:(_id: string,notes:string) => ipcRenderer.invoke("offline-users:saveNotes", _id,notes),

    login: (credentials: LoginCredentials) =>
      ipcRenderer.invoke("offline-users:login", credentials),

    getById: (_id: string) => ipcRenderer.invoke("offline-users:getById", _id),

    getByEmail: (email: string) =>
      ipcRenderer.invoke("offline-users:getByEmail", email),

    getAll: () => ipcRenderer.invoke("offline-users:getAll"),

    delete: (_id: string) => ipcRenderer.invoke("offline-users:delete", _id),
  },

  employees: {
    create: (employee: Partial<Employee>) =>
      ipcRenderer.invoke("employees:create", employee),

    uploadPhoto: (employeeId: string, file: { name: string; buffer: ArrayBuffer }) =>
  ipcRenderer.invoke("employees:uploadPhoto", employeeId, {
    name: file.name,
    buffer: Buffer.from(file.buffer), 
  }),

  getPhotoUrl: (relativePath: string) =>
    ipcRenderer.invoke("photos:getUrl", relativePath),

    getAll: () => ipcRenderer.invoke("employees:getAll"),

    getById: (_id: string) => ipcRenderer.invoke("employees:getById", _id),

    update: (_id: string, updates: Partial<Employee>) =>
      ipcRenderer.invoke("employees:update", _id, updates),

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

    update: (_id: string, updates: Partial<AttendanceWithEmployee>) =>
      ipcRenderer.invoke("attendance:update", _id, updates),

    delete: (_id: string) => ipcRenderer.invoke("attendance:delete", _id),


  },

  leave: {
    create: (
   leave:Partial<Leave>
    ) =>
      ipcRenderer.invoke(
        "leave:create",
       leave
      ),

      
    getLeaveById: (_id: string) =>
      ipcRenderer.invoke("leave:getLeaveById", _id),

    getLeaveByEmployeeId: (employeeId: string) =>
      ipcRenderer.invoke("leave:getLeaveByEmployeeId", employeeId),

    getOngoingLeaves:()=>ipcRenderer.invoke("leave:getOnGoing"),

    getLeaveByMonth: (month: string) =>
      ipcRenderer.invoke("leave:getLeaveByMonth", month),

    update: (
      _id: string,
      updates:Partial<Leave>
    ) => ipcRenderer.invoke("leave:update", _id, updates),

    delete: (_id: string) => ipcRenderer.invoke("leave:delete", _id),
  },
          
   tasks: {
    create: (task: Task) => ipcRenderer.invoke("tasks:create", task),

    update:(task: Task) => ipcRenderer.invoke("tasks:update", task),

    getAll: () => ipcRenderer.invoke("tasks:getAll"),

    getTopTasks:(userId:string)=>ipcRenderer.invoke("tasks:getTopTasks",userId),

    delete: (taskId: string) => ipcRenderer.invoke("tasks:delete", taskId),

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

  taskComments: {
  create: (payload: {
    taskId: string;
    author: string;
    message: string;
  }) => ipcRenderer.invoke("task-comments:create", payload),

  getByTaskId: (taskId: string) =>
    ipcRenderer.invoke("task-comments:get", taskId),

  delete: (commentId: string) =>
    ipcRenderer.invoke("task-comments:delete", commentId),
},

  adminUsers: {
    getAll: () => ipcRenderer.invoke("adminUsers:getAll"),
  },

  file: { save: (data: string) => ipcRenderer.invoke("save-file", data) },

  sync: () => ipcRenderer.invoke("sync:run"),
}) satisfies Window["electron"];
