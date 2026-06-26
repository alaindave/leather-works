import AdminUser from "./AdminUser.js";
import TaskComment from "./TaskComment.js";

type Priority = "Haute" | "Moyenne" | "Basse" | "";

export default interface Task {
  _id: string;
  taskNumber?: string;
  author: string;
  recipients: AdminUser[];
  subject: string;
  message: string;
  comments?: TaskComment[];
  priority: Priority;
  deadline: string;
  isResolved?: number;
  resolutionNotes?: string;
  submittedAt?: string;
  resolvedAt?: string;
  resolvedBy?: AdminUser;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced?: number;
  isDeleted?: number;
}
