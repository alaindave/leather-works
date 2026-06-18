export default interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeID: string;
  idNum: string;
  dateBirth: Date;
  matricule: string;
  dateBirth: string;
  role: string;
  dateHired: Date;
  department: string;
  dateHired: string;
  salary: number;
  status: "actif" | "inactif";
  telephone: string;
  address: string;
  emergencyContact: string;
  relationship: string;
  contactPhone: string;
  salary: string;
  status: string;
  remainingLeave: number;
  synced: number;
  isDeleted: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
}
