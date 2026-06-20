import { AdminUser } from "./AdminUser.js";

export interface PopulatedTask {
  _id: string;
  author: AdminUser;
  recipients: AdminUser[];
  subject: string;
  message: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}
