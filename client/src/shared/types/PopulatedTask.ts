import AdminUser from "./AdminUser.js";
import User from "./User.js";
type Priority = "Haute" | "Moyenne" | "Basse" | "";

export interface PopulatedTask {
  _id: string;
  author: User;
  recipients: AdminUser[];
  subject: string;
  message: string;
  priority: Priority;
  createdAt: string;
}
