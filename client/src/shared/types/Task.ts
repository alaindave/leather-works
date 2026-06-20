export default interface Task {
  _id: string;
  author: string;
  recipients: string[];
  subject: string;
  message: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}
