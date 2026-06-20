export default interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  idNum: string;
  dateBirth: string;
  role: string;
  department: string;
  dateHired: string;
  salary: number;
  status: "actif" | "inactif";
  telephone: string;
  address: string;
  emergencyContact: string;
  relationship: string;
  contactPhone: string;
  remainingLeave: number;
  synced: number;
  isDeleted: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
}
