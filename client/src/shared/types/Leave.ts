export default interface Leave {
  _id: string;
  employeeId: string;
  submittedAt: string;
  submittedMonth: string;
  startDate: string;
  endDate: string;
  subject: string;
  notes: string;
  status: string;
  synced: number;
  isDeleted: number;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
}
