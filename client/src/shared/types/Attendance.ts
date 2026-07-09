export default interface Attendance {
  _id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: "PONCTUEL" | "RETARD" | "ABSENT";
  lateMinutes?: number;
  lateNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced: number;
  isDeleted: number;
}
