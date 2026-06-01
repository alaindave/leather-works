export {};
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
    };
  }
}
