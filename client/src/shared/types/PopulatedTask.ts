import AdminUser from "./AdminUser.js";
type Priority = "Haute" | "Moyenne" | "Basse" | "";

export interface PopulatedTask {
  _id: string;
  author: AdminUser;
  recipients: AdminUser[];
  subject: string;
  message: string;
  priority: Priority;
  createdAt: string;
}
