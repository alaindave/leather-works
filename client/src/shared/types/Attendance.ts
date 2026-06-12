export default interface Attendance {
  _id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: "ponctuel" | "retard" | "absent" | "congé";
  lateMinutes?: number;
  lateNotes?: string;
  synced: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
}
