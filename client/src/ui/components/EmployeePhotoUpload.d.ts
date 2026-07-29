interface Props {
    employeeId: string;
    currentPhoto?: string | null;
    onUploaded?: () => void;
}
export default function EmployeePhotoUpload({ employeeId, currentPhoto, onUploaded, }: Props): import("react").JSX.Element;
export {};
