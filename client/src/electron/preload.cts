const { contextBridge, ipcRenderer } = require("electron");
type OfflineUser = import("../common/types/OfflineUser", { with: { "resolution-mode": "require" } }).default;
type Employee = import("../common/types/Employee", { with: { "resolution-mode": "require" } }).default;
type AdminUser = import("../common/types/AdminUser", { with: { "resolution-mode": "require" } }).default;
type AttendanceWithEmployee = import("../common/types/AttendanceWithEmployee", { with: { "resolution-mode": "require" } }).default;
type Leave = import("../common/types/Leave", { with: { "resolution-mode": "require" } }).default;
type Task = import("../common/types/Task", { with: { "resolution-mode": "require" } }).default;
type EmployeeDocument=typeof import("../common/types/EmployeeDocuments", { with: { "resolution-mode": "require" } });
type UploadedEmployeeDocument=typeof import("../common/types/EmployeeDocuments", { with: { "resolution-mode": "require" } });
type CreatePayrollComponentDto = import("../common/types/payroll/PayrollComponent", { with: { "resolution-mode": "require" } }).default;
type CreatePayrollProfileDto = import("../common/types/payroll/CreatePayrollProfileDto", { with: { "resolution-mode": "require" } }).default;
type PayrollComponent = import("../common/types/payroll/PayrollComponent", { with: { "resolution-mode": "require" } }).default;
type EmployeePayrollProfile = import("../common/types/payroll/PayrollEmployeeProfile", { with: { "resolution-mode": "require" } }).default;
type AttendanceDailyCheckPreparationInput =typeof import("../common/types/AttendanceDailyCheck", { with: { "resolution-mode": "require" } });
type LockAttendanceDailyCheckInput = typeof import("../common/types/AttendanceDailyCheck", { with: { "resolution-mode": "require" } });
type MarkManagerNotifiedInput =typeof import("../common/types/AttendanceDailyCheck", { with: { "resolution-mode": "require" } });
type VerifyAttendanceDailyCheckInput = typeof import("../common/types/AttendanceDailyCheck", { with: { "resolution-mode": "require" } });
type CreateAttendanceDto = typeof import("../common/types/Attendance", { with: { "resolution-mode": "require" } });
type SyncStatusEvent = typeof import("../common/types/sync", { with: { "resolution-mode": "require" } });

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  firstName:string;
  lastName:string;
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
    sign_up: (credentials: SignUpCredentials) =>
      ipcRenderer.invoke("auth:signup", credentials),
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

  employees_documents:{
    view:(localPath: string)=> 
    ipcRenderer.invoke("employee_documents:view",localPath),
    download:(document: EmployeeDocument) =>
    ipcRenderer.invoke("employee_documents:download",document),
    delete:(_id: string) =>
    ipcRenderer.invoke("employee_documents:delete",_id),
    upload: (document: UploadedEmployeeDocument) =>
    ipcRenderer.invoke("employees-documents:upload",document),
    create: (document: EmployeeDocument) =>
    ipcRenderer.invoke("employees-documents:create", document),
    getAll: () =>
    ipcRenderer.invoke("employees-documents:get-all"),
    getById: (_id: string) =>
    ipcRenderer.invoke("employees-documents:get-by-id", _id),
    getByEmployee: (employeeId: string) =>
    ipcRenderer.invoke("employees-documents:get-by-employee", employeeId),
    getByType: (employeeId: string,documentType: string) =>
     ipcRenderer.invoke("employees-documents:get-by-type",
      employeeId,
      documentType
    ),
    update: (document: EmployeeDocument) =>
    ipcRenderer.invoke("employees-documents:update", document),
    getUnsynced: () =>
    ipcRenderer.invoke("employees-documents:get-unsynced"),
    markSynced: (id: string) =>
    ipcRenderer.invoke("employees-documents:mark-synced", id),
    upsert: (document: EmployeeDocument) =>
    ipcRenderer.invoke("employees-documents:upsert", document),
  },

  attendance: {
    create: (input: CreateAttendanceDto) =>
      ipcRenderer.invoke("attendance:create", input),

    createAbsenceLeave: (employeeId: string, status: "CONGÉ" | "ABSENT",date:string) =>
      ipcRenderer.invoke("attendance:createAbsenceLeave", employeeId, status,date),

    getAll: () => ipcRenderer.invoke("attendance:getAll"),

    getById: (_id: string) => ipcRenderer.invoke("attendance:getById", _id),

    getByEmployee: (employeeId: string) =>
      ipcRenderer.invoke("attendance:getByEmployee", employeeId),

    getEmployeesWithoutAttendance: (date: string) =>
      ipcRenderer.invoke("attendance:getEmployeesWithoutAttendance", date),

    getByDate: (date: string) =>
      ipcRenderer.invoke("attendance:getByDate", date),

    getAttendanceRecord: (employeeId: string, date: string) =>
      ipcRenderer.invoke("attendance:getAttendanceRecord", employeeId, date),

    update: (_id: string,date:string, updates: Partial<AttendanceWithEmployee>) =>
      ipcRenderer.invoke("attendance:update", _id,date,updates),

    markAbsent: (date:string) =>
      ipcRenderer.invoke(
        "attendance:mark-absent",date),

    delete: (_id: string) => ipcRenderer.invoke("attendance:delete", _id),


  },

 attendanceDailyCheck: {
  create: (input: AttendanceDailyCheckPreparationInput) =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:create",
      input
    ),

  getById: (_id: string) =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:getById",
      _id
    ),

  getByDate: (date: string) =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:getByDate",
      date
    ),

  getAll: () =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:getAll"
    ),

  completeMarkAbsent: (completedAt: string) =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:completeMarkAbsent",
      completedAt
    ),

  verify: (input: VerifyAttendanceDailyCheckInput) =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:verify",
      input
    ),

  notifyManager: (input: MarkManagerNotifiedInput) =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:notifyManager",
      input
    ),

  lock: (input: LockAttendanceDailyCheckInput) =>
    ipcRenderer.invoke(
      "attendanceDailyCheck:lock",
      input
    ),
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

    getOngoingLeaves:(date:string)=>ipcRenderer.invoke("leave:getOnGoing",date),

    getLeaveByMonth: (month: string) =>
      ipcRenderer.invoke("leave:getLeaveByMonth", month),

    update: (
      _id: string,
      updates:Partial<Leave>
    ) => ipcRenderer.invoke("leave:update", _id, updates),

    cancel: (_id: string) => ipcRenderer.invoke("leave:cancel", _id),

    delete: (_id: string) => ipcRenderer.invoke("leave:delete", _id),
  },
          
   tasks: {
    create: (task: Task) => ipcRenderer.invoke("tasks:create", task),

    update:(task: Task) => ipcRenderer.invoke("tasks:update", task),

    getAll: () => ipcRenderer.invoke("tasks:getAll"),

    getById: (_id:string) => ipcRenderer.invoke("tasks:getById",_id),

    getUserTasks:(userId:string)=>ipcRenderer.invoke("tasks:getUserTasks",userId),

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

   onSyncStatus: (
    callback: (event: SyncStatusEvent) => void
  ) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      data: SyncStatusEvent
    ) => {
      callback(data);
    };

    ipcRenderer.on("sync:status", listener);

    return () => {
      ipcRenderer.removeListener("sync:status", listener);
    };
  },

  onPendingChanges: (
    callback: (data: {
      pendingChanges: number;
      timestamp: string;
    }) => void
  ) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      data: {
        pendingChanges: number;
        timestamp: string;
      }
    ) => {
      callback(data);
    };

    ipcRenderer.on("sync:pending-changes", listener);

    return () => {
      ipcRenderer.removeListener("sync:pending-changes", listener);
    };
  },

 payrollSettings: {
  get: () =>
      ipcRenderer.invoke(
        "payroll-settings:get"
      ),

  getById: (_id: string) =>
      ipcRenderer.invoke(
        "payroll-settings:getById",
        _id
      ),

  create: (data: {
      currency: string;
      workingDays: number;
      workingHours: number;
      paymentDay: number;
    }) =>
      ipcRenderer.invoke(
        "payroll-settings:create",
        data
      ),
  update: (settings: {
      _id: string;
      currency: string;
      workingDays: number;
      workingHours: number;
      paymentDay: number;
      synced: number;
      createdAt: string;
      updatedAt: string;
      lastSyncedAt?: string;
      isDeleted: number;
    }) =>
      ipcRenderer.invoke(
        "payroll-settings:update",
        settings
      ),

  updateFields: (
      _id: string,
      fields: {
        currency?: string;
        workingDays?: number;
        workingHours?: number;
        paymentDay?: number;
      }
    ) =>
      ipcRenderer.invoke(
        "payroll-settings:updateFields",
        _id,
        fields
      ),

  delete: (_id: string) =>
      ipcRenderer.invoke(
        "payroll-settings:delete",
        _id
      ),

  restore: (_id: string) =>
      ipcRenderer.invoke(
        "payroll-settings:restore",
        _id
      ),

  markSynced: (_id: string) =>
      ipcRenderer.invoke(
        "payroll-settings:markSynced",
        _id
      ),

  getUnsynced: () =>
      ipcRenderer.invoke(
        "payroll-settings:getUnsynced"
      ),
  },

 payrollComponents: {
  create: (component:CreatePayrollComponentDto) =>
    ipcRenderer.invoke("payroll-components:create", component),

  getAll: (type?: "EARNING" | "DEDUCTION") =>
    ipcRenderer.invoke("payroll-components:getAll", type),

  getEnabled: (type?: "EARNING" | "DEDUCTION") =>
    ipcRenderer.invoke("payroll-components:getEnabled", type),

  getById: (id: string) =>
    ipcRenderer.invoke("payroll-components:getById", id),

  update: (components:PayrollComponent[]) =>
    ipcRenderer.invoke("payroll-components:update", components),

  delete: (id: string) =>
    ipcRenderer.invoke("payroll-components:delete", id),

  enable: (id: string) =>
    ipcRenderer.invoke("payroll-components:enable", id),

  disable: (id: string) =>
    ipcRenderer.invoke("payroll-components:disable", id),

  upsert: (component:PayrollComponent) =>
    ipcRenderer.invoke("payroll-components:upsert", component),

  getUnsynced: () =>
    ipcRenderer.invoke("payroll-components:getUnsynced"),

  markSynced: (id: string) =>
    ipcRenderer.invoke("payroll-components:markSynced", id),
},

payrollEmployeeProfiles: {
  create: (employeeID:string,profile: CreatePayrollProfileDto) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:create",employeeID,
      profile
    ),

  createMany: (profiles: CreatePayrollProfileDto[]) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:createMany",
      profiles
    ),

  update: (profile: EmployeePayrollProfile) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:update",
      profile
    ),

  updateMany: (profiles: EmployeePayrollProfile[]) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:updateMany",
      profiles
    ),

  upsert: (profile: EmployeePayrollProfile) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:upsert",
      profile
    ),

  upsertMany: (profiles: EmployeePayrollProfile[]) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:upsertMany",
      profiles
    ),

  get: (_id: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:get",
      _id
    ),

  getAll: (employeeID?:string,type?: "EARNING" | "DEDUCTION") =>
    ipcRenderer.invoke("payrollEmployeeProfiles:getAll", employeeID,type),

  getByEmployee: (employeeId: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:getByEmployee",
      employeeId
    ),

  getByComponent: (
    employeeId: string,
    componentId: string
  ) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:getByComponent",
      employeeId,
      componentId
    ),

  getUnsynced: () =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:getUnsynced"
    ),

  markSynced: (_id: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:markSynced",
      _id
    ),

  markManySynced: (ids: string[]) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:markManySynced",
      ids
    ),

  delete: (_id: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:delete",
      _id
    ),

  restore: (_id: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:restore",
      _id
    ),

  permanentlyDelete: (_id: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:permanentlyDelete",
      _id
    ),

  exists: (
    employeeId: string,
    componentId: string
  ) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:exists",
      employeeId,
      componentId
    ),

  count: () =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:count"
    ),

  initialize: () =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:initialize"
    ),

  initializeForEmployee: (employeeId: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:initializeForEmployee",
      employeeId
    ),

  addComponentToEmployees: (component: PayrollComponent) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:addComponentToEmployees",
      component
    ),

  resetToDefaults: (employeeId: string) =>
    ipcRenderer.invoke(
      "payrollEmployeeProfiles:resetToDefaults",
      employeeId
    ),
},

payrollRun: {

  createPayrollDraft: (
    admin: AdminUser
  ) => {
    return ipcRenderer.invoke(
      "payroll:createDraft",
      admin
    );
  },

  getPayrollRuns: () => {
    return ipcRenderer.invoke(
      "payroll:getRuns"
    );
  },

  getPayrollRunById: (
    id: string
  ) => {
    return ipcRenderer.invoke(
      "payroll:getRunById",
      id
    );
  },

  // BROUILLON → EN_VERIFICATION
  submitForVerification: (
    payrollRunId: string,admin:AdminUser
  ) => {
    return ipcRenderer.invoke(
      "payroll:submitForVerification",
      payrollRunId,admin
    );
  },

  // EN_VERIFICATION → BROUILLON
  returnToDraft: (
    payrollRunId: string
  ) => {
    return ipcRenderer.invoke(
      "payroll:returnToDraft",
      payrollRunId
    );
  },

  // EN_VERIFICATION → APPROUVÉ
  approvePayroll: (
    payrollRunId: string,
    adminUser:AdminUser
  ) => {
    return ipcRenderer.invoke(
      "payroll:approve",
      payrollRunId,adminUser
    );
  },

  // APPROUVÉ → PAYÉ
  markPayrollAsPaid: (
    payrollRunId: string,adminUser: AdminUser
  ) => {
    return ipcRenderer.invoke(
      "payroll:markAsPaid",
      payrollRunId,adminUser
    );
  },

  // BROUILLON / EN_VERIFICATION / APPROUVÉ → ANNULÉ
  cancelPayroll: (
    payrollRunId: string,
    admin:AdminUser
  ) => {
    return ipcRenderer.invoke(
      "payroll:cancel",
      payrollRunId,admin
    );
  },

  getPayrollResults: (
    payrollRunId: string
  ) => {
    return ipcRenderer.invoke(
      "payroll:getResults",
      payrollRunId
    );
  },

  getEmployeePayrollResults:(
  employeeId: string,
  payrollRunId?: string,
)=> {
    return ipcRenderer.invoke(
      "payroll:getEmployeeResults",
      employeeId,
      payrollRunId
    );
  },

  getPayrollItems: (
    payrollResultId: string,
    employeeId?: string
  ) => {
    return ipcRenderer.invoke(
      "payroll:getItems",
      payrollResultId,
      employeeId
    );
  },

  deletePayrollRun: (
    payrollRunId: string
  ) => {
    return ipcRenderer.invoke(
      "payroll:deleteRun",
      payrollRunId
    );
  },

  
},

notifications: {
  scheduleReminder: (
    message: string,
    remindAt: string
  ) =>
    ipcRenderer.invoke(
      "notifications:schedule-reminder",
      message,
      remindAt
    ),

  cancelReminder: (id: string) =>
    ipcRenderer.invoke(
      "notifications:cancel-reminder",
      id
    ),

  cancelAllReminders: () =>
    ipcRenderer.invoke(
      "notifications:cancel-all-reminders"
    ),
},

}) satisfies Window["electron"];