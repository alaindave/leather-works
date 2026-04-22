import type Employee from "./Employee";

export default interface Leave {
  _id: string;
  employee: Employee;
  startDate: string;
  endDate: string;
  notes: string;
}
