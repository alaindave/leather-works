import AdminUser from "./AdminUser.js";
import PopulatedTaskComment from "./PopulatedTaskComment.js";
import User from "./User.js";

type Priority = "Haute" | "Moyenne" | "Basse" | "";

export default interface Task {
  _id: string;
  taskNumber?: string;
  author: Omit<User, "password" | "notes">;
  recipients: AdminUser[];
  subject: string;
  message: string;
  comments?: PopulatedTaskComment[];
  priority: Priority;
  deadline: string;
  isResolved?: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced?: number;
  isDeleted?: number;
}
