export default interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeID: string;
  dateBirth: Date;
  role: string;
  department: string;
  dateHired: Date;
  salary: string;
  status: "actif" | "inactif";
  telephone: string;
  address: string;
  emergencyContact: string;
  relationship: string;
  contactPhone: string;
  remainingLeave: number;
  synced: number;
  createdAt?: string;
  updatedAt?: string;
}
