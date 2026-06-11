export {};
import type Employee from "./Employee";

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

interface Announcement {
  _id: string;
  message: string;
  createdAt: string;
  createdBy?: string;
}

declare global {
  interface Window {
    electron: {
      file: { save: (data: string) => Promise<SaveFileResult> };

      auth: {
        login: (credentials: AdminCredentials) => Promise<LoggedUser>;
        logout: () => boolean;
      };

      announcements: {
        getAnnouncements: () => Promise<Announcement[]>;

        createAnnouncement: (
          data: Omit<Announcement, "_id" | "createdAt">
        ) => Promise<Announcement>;

        onNew: (callback: (data: Announcement) => void) => () => void;
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
    };
  }
}
