export {};
import type Employee from "./Employee";
import type Attendance from "./Attendance";
import type Leave from "./Leave";
import type AttendanceWithEmployee from "./AttendanceWithEmployee";
import type LeaveWithEmployee from "./LeaveWithEmployee";
import type Task from "./Task";
import AdminUser from "./AdminUser";

interface SaveFileResult {
  success: boolean;
  filePath?: string;
}

interface AdminCredentials {
  email: string;
  password: string;
}

interface LoggedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "manager" | "admin";
}

declare global {
  interface Window {
    electron: {
      file: { save: (data: string) => Promise<SaveFileResult> };

      auth: {
        login: (credentials: AdminCredentials) => Promise<LoggedUser>;
        logout: () => boolean;
      };

      offlineUsers: {
        save: (user: OfflineUser) => Promise<LoggedUser>;

        login: (credentials: LoginCredentials) => Promise<LoggedUser>;

        getById: (_id: string) => Promise<LoggedUser>;

        getByEmail: (email: string) => Promise<LoggedUser>;

        getAll: () => Promise<LoggedUser[]>;

        delete: (_id: string) => Promise<LoggedUser>;
      };

      tasks: {
        create: (data: Omit<Task, "_id" | "createdAt">) => Promise<Task>;

        getAll: () => Promise<Task[]>;

        onNew: (callback: (data: Task) => void) => () => void;
      };

      adminUsers: {
        getAll: () => Promise<AdminUser[]>;
      };

      employees: {
        create: (employee: Partial<Employee>) => Promise<Employee>;
        getAll: () => Promise<Employee[]>;
        getById: (_id: string) => Promise<Employee | null>;
        search: (searchTerm: string) => Promise<Employee[]>;
        update: (
          _id: string,
          data: Partial<Employee>
        ) => Promise<Employee | null>;
        delete: (_id: string) => Promise<void>;
      };

      attendance: {
        create: (employeeID: string, clockIn: string) => Promise<Attendance>;
        getAll: () => Promise<Attendance[]>;
        getById: (_id: string) => Promise<AttendanceWithEmployee | null>;
        getByEmployee: (
          employeeId: string
        ) => Promise<AttendanceWithEmployee[]>;
        getByDate: (date: string) => Promise<AttendanceWithEmployee[]>;
        getAttendanceRecord: (
          employeeId: string,
          date: string
        ) => Promise<Attendance>;
        updateClockIn: (
          _id: string,
          clockIn: string
        ) => Promise<AttendanceWithEmployee>;
        updateClockOut: (
          _id: string,
          clockOut: string
        ) => Promise<AttendanceWithEmployee>;
        submitLateNotes: (
          _id: string,
          lateNotes: string | undefined
        ) => Promise<Attendance>;
        delete: (_id: string) => Promise<boolean>;
        clockOut: (
          _id: string,
          clockOut: string
        ) => Promise<AttendanceWithEmployee | undefined>;
      };

      leave: {
        create: (
          employeeId: string,
          startDate: string,
          endDate: string,
          subject: string,
          notes: string
        ) => Promise<LeaveWithEmployee>;

        getLeaveById: (_id: string) => Promise<LeaveWithEmployee>;

        getOngoingLeaves: () => Promise<Leave[]>;

        getLeaveByMonth: (month: string) => Promise<LeaveWithEmployee[]>;

        update: (
          _id: string,
          updates: {
            subject?: string;
            notes?: string;
            startDate?: string;
            endDate?: string;
            status?: string;
          }
        ) => Promise<LeaveWithEmployee>;

        delete: (_id: string) => Promise<Leave>;
      };

      sync: () => Promise<{
        success: boolean;
        message?: string;
      }>;
    };
  }
}
