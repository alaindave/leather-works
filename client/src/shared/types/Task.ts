import AdminUser from "./AdminUser.js";
import TaskRecipient from "./TaskRecipient.js";
type Priority = "Haute" | "Moyenne" | "Basse" | "";

export default interface Task {
  _id: string;
  author: Omit<AdminUser, "password" | "notes">;
  recipients: TaskRecipient[];
  subject: string;
  message: string;
  deadline: string;
  priority: Priority;
  createdAt: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced?: number;
  isDeleted?: number;
}
