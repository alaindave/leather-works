import Employee from "../../common/types/Employee";
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
    employees: Employee[];
}
declare const LeaveSubmissionModal: ({ isOpen, onClose, onRefresh, employees, }: Props) => import("react").JSX.Element;
export default LeaveSubmissionModal;
