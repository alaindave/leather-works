export default interface SyncQueueItem {
  _id?: number;
  entity:
    | "employee"
    | "attendance"
    | "leave"
    | "task"
    | "task_comment"
    | "user_notes"
    | "employee_photo"
    | "employee_document";
  entityId: string;
  operation: "create" | "update" | "delete";
  payload: string;
  synced?: number;
  createdAt?: string;
}
