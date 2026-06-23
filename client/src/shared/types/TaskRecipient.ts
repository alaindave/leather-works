export default interface TaskRecipient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "manager" | "admin";
  createdAt: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  isDeleted: number;
}
