export default interface PayrollSettings {
    _id: string;
    currency: string;
    workingDays: number;
    paymentDay: number;
    synced: number;
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    lastSyncedAt?: string;
}
