export default interface OfflineUser {
  _id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "manager";
  firstName: string;
  lastName: string;
  lastVerifiedAt: string;
}
