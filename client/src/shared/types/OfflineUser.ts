export default interface OfflineUser {
  _id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "manager";
  firstName: string;
  lastName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt: string;
}
