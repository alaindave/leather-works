export default interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "manager" | "admin";
  createdAt: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced: number;
  isDeleted: number;
}
