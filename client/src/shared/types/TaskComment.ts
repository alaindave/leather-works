import AdminUser from "./AdminUser.js";

export default interface TaskComment {
  _id: string;
  taskId: string;
  author: AdminUser;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  synced?: number;
  lastSyncedAt?: string;
  isDeleted?: number;
}
