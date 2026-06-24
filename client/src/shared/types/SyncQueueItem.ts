export default interface SyncQueueItem {
  _id?: number;
  entity: "employee" | "attendance" | "leave" | "task";
  entityId: string;
  operation: "create" | "update" | "delete";
  payload: string;
  synced?: number;
  createdAt?: string;
}
