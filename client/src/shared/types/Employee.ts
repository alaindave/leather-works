export default interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  idNum: string;
  dateBirth: string;
  dateHired: string;
  role: string;
  department: string;
  salary: number;
  remainingLeave: number;
  status: "actif" | "inactif";
  telephone: string;
  address: string;
  emergencyContact: string;
  relationship: string;
  contactPhone: string;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  synced: number;
  isDeleted: number;
}
