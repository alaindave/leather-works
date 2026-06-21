import { AdminUserData } from "./AdminUser.js";
type Priority = "Haute" | "Moyenne" | "Basse" | "";

export default interface Task {
  _id: string;
  author: AdminUserData;
  recipients: AdminUserData[];
  subject: string;
  message: string;
  deadline: string;
  priority: Priority;
  createdAt: string;
}
