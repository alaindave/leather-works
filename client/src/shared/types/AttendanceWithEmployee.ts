import type Attendance from "./Attendance.js";

export default interface AttendanceWithEmployee extends Attendance {
  firstName: string;
  lastName: string;
  matricule: string;
  role: string;
  department: string;
}
