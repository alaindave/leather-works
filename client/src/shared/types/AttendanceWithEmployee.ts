import type Attendance from "./Attendance.js";

export interface AttendanceWithEmployee extends Attendance {
  firstName: string;
  lastName: string;
  matricule: string;
  role: string;
  department: string;
}
