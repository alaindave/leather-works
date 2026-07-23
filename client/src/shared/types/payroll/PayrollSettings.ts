export default interface PayrollSettings {
  _id: string;
  currency: string;
  workingDays: number;
  workingHoursPerDay: number;
  paymentDay: number;
  defaultPayrollStatus: "DRAFT" | "APPROVED" | "PAID";
  showCompanyLogo: number;
  showCompanyAddress: number;
  showDepartment: number;
  showPosition: number;
  showEmployeeNumber: number;
  showPhoneNumber: number;
  showEmail: number;
  showSignature: number;
  decimalPlaces: number;
  paperSize: "A4" | "LETTER";
  orientation: "PORTRAIT" | "LANDSCAPE";
  synced: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
}
