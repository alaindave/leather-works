import type Employee from "./Employee";

export default interface Attendance {
  _id: string;
  employee: Employee;
  date: string;
  clockIn: Date;
  clockOut: Date;
  lateMinutes: number;
  status: string;
  lateNotes: string;
}
