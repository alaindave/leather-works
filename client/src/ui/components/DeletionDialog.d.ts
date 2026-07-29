interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirmation: () => void;
    header: string;
    body: string;
}
declare const DeletionDialog: ({ isOpen, onClose, onConfirmation, header, body, }: Props) => import("react").JSX.Element;
export default DeletionDialog;
