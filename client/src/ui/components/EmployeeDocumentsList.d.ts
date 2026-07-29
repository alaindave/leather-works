import { EmployeeDocument } from "../../common/types/EmployeeDocuments";
interface EmployeeDocumentsListProps {
    documents: EmployeeDocument[];
    onView?: (document: EmployeeDocument) => void;
    onDownload?: (document: EmployeeDocument) => void;
    onDelete?: (document: EmployeeDocument) => void;
}
export default function EmployeeDocumentsList({ documents, onView, onDownload, onDelete, }: EmployeeDocumentsListProps): import("react").JSX.Element;
export {};
