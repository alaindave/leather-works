import AdminUser from "./AdminUser.js";
type Priority = "Haute" | "Moyenne" | "Basse" | "";

export default interface Task {
  _id: string;
  taskNumber?: string;
  author: string;
  recipients: AdminUser[];
  subject: string;
  message: string;
  deadline: string;
  priority: Priority;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced?: number;
  isDeleted?: number;
}
