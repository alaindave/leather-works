interface PdfUploadProps {
    employeeId: string;
    uploadedBy?: string;
    onUploaded?: (uploaded: boolean) => void;
}
export default function PdfUpload({ employeeId, uploadedBy, onUploaded, }: PdfUploadProps): import("react").JSX.Element;
export {};
