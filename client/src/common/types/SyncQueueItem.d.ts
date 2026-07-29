export default interface SyncQueueItem {
    _id?: number;
    entity: "employee" | "attendance" | "leave" | "task" | "task_comment" | "user_notes" | "employee_photo" | "employee_document" | "payroll_component" | "payroll_profile";
    entityId: string;
    operation: "create" | "update" | "delete";
    payload: string;
    synced?: number;
    createdAt?: string;
}
