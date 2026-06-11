export default interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeID: string;
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
  createdAt?: string;
  updatedAt?: string;
}
