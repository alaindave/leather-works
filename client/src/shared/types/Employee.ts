export default interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeID: string;
  idNum: string;
  dateBirth: Date;
  role: string;
  dateHired: Date;
  department: string;
  telephone: string;
  address: string;
  emergencyContact: string;
  relationship: string;
  contactPhone: string;
  salary: string;
  status: string;
  remainingLeave: number;
  synced: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string | null;
}
