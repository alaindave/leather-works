import type Employee from "./Employee";

export default interface Leave {
  _id: string;
  employee: Employee;
  startDate: Date;
  endDate: Date;
  subject: string;
  notes: string;
  status: string;
}
