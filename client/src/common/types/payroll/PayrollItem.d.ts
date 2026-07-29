import { PayrollComponentType } from "./PayrollComponent.js";
export default interface PayrollItem {
    _id: string;
    payrollId: string;
    componentId: string;
    name: string;
    type: PayrollComponentType;
    amount: number;
    calculationMethod?: string;
    rate?: number;
    quantity?: number;
    notes?: string;
    synced: number;
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    lastSyncedAt?: string;
}
