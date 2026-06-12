import type Attendance from "./types/Attendance";

export interface AttendanceWithEmployee extends Attendance {
  firstName: string;
  lastName: string;
  employeeID: string;
  role: string;
  department: string;
}
