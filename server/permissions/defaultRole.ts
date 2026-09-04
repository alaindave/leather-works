import { RoleDefinition } from "../types/Permissions.js";

export const defaultRoles: RoleDefinition[] = [
  {
    name: "MANAGER",
    permissions: [
      "employees.read",
      "employees.write",
      "attendance.read",
      "attendance.write",
      "leave.read",
      "leave.write",
      "payroll.read",
      "payroll.write",
      "payroll.approve",
      "payroll.pay",
      "inventory.read",
      "inventory.write",
      "production.read",
      "production.write",
      "accounting.read",
      "accounting.write",
      "users.read",
      "users.write",
      "settings.read",
      "settings.write",
    ],
  },

  {
    name: "ADMIN",
    permissions: [
      "employees.read",
      "employees.write",
      "attendance.read",
      "attendance.write",
      "leave.read",
      "leave.write",
      "payroll.read",
      "payroll.write",
      "inventory.read",
      "inventory.write",
      "production.read",
      "production.write",
      "accounting.read",
    ],
  },

  {
    name: "VIEWER",
    permissions: [
      "employees.read",
      "attendance.read",
      "leave.read",
      "payroll.read",
      "inventory.read",
      "production.read",
      "accounting.read",
    ],
  },
];
