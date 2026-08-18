export type AttendanceDailyCheckStatus =
  | "PREPARING"
  | "OPEN"
  | "VERIFIED"
  | "MANAGER_NOTIFIED"
  | "LOCKED";

export interface AttendanceDailyCheck {
  _id: string;
  date: string;
  status: AttendanceDailyCheckStatus;
  markAbsentCompleted: number | null;
  markAbsentCompletedAt: string | null;
  markLeaveCompleted: number | null;
  markLeaveCompletedAt: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  managerId: string | null;
  managerNotifiedAt: string | null;
  managerNotifiedTo: string | null;
  lockedAt: string | null;
  lockedBy: string | null;
  synced: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: number;
}

export interface AttendanceDailyCheckPreparationInput {
  markAbsentCompleted: {
    completed: boolean;
    completedAt: string | null;
  };

  markLeaveCompleted: {
    completed: boolean;
    completedAt: string | null;
  };

  date: string;
}

export interface VerifyAttendanceDailyCheckInput {
  date: string;
  verifiedBy: string;
}

export interface VerifyDailyAttendanceResult {
  success: boolean;
  date: string;
  checkId: string;
  verifiedBy: string;
  employeeCount: number;
  attendanceCount: number;
  missingEmployeeIds: string[];
}

export interface MarkManagerNotifiedInput {
  date: string;
}

export interface LockAttendanceDailyCheckInput {
  date: string;
  lockedBy: string;
  lockedByRole: "ADMIN" | "MANAGER";
}
