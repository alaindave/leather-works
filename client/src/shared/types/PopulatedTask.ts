import AdminUser from "./AdminUser.js";
type Priority = "Haute" | "Moyenne" | "Basse" | "";

export default interface PopulatedTask {
  _id: string;
  taskNumber?: string;
  author: AdminUser;
  recipients: AdminUser[];
  subject: string;
  message: string;
  priority: Priority;
  createdAt: string;
  deadline: string;
}
