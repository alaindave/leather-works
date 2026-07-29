import { EmployeeDocumentType } from "../../common/types/EmployeeDocuments";
interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeId: string;
    uploadedBy?: string;
    documentType: EmployeeDocumentType;
    onRefresh?: () => void;
}
export default function UploadDocumentModal({ isOpen, onClose, employeeId, uploadedBy, documentType, onRefresh, }: UploadDocumentModalProps): import("react").JSX.Element;
export {};
