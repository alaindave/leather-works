export const SYNC_ENTITIES = {
  EMPLOYEE: "employee",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  PAYROLL_COMPONENT: "payroll_component",
  PAYROLL_PROFILE: "payroll_profile",
  PAYROLL_RUN: "payroll_run",
  PAYROLL_RESULT: "payroll_result",
  PAYROLL_ITEM: "payroll_item",
  PAYROLL_SETTINGS: "payroll_settings",
  TASK: "task",
} as const;

export type SyncEntity = (typeof SYNC_ENTITIES)[keyof typeof SYNC_ENTITIES];
