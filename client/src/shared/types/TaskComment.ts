export default interface TaskComment {
  _id: string;
  taskId: string;
  author: string;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  synced?: number;
  lastSyncedAt?: string;
  isDeleted?: number;
}
