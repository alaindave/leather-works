export default interface Attendance {
  _id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: "PONCTUEL" | "RETARD" | "ABSENT" | "CONGÉ";
  source: "MANUAL" | "AUTO_CLIENT" | "AUTO_SERVER";
  lateMinutes?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced?: number;
  isDeleted?: number;
}

export interface PayrollAttendanceSummary {
  employeeId: string;
  lateDays: number;
  totalLateMinutes: number;
  absentDays: number;
}

export interface CreateAttendanceDto {
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status?: string;
}
