import { LeaveWithEmployee } from "../../common/types/LeaveWithEmployee";
interface Props {
    leave: LeaveWithEmployee;
    onUpdated?: () => void;
    isOpen: boolean;
    onClose: () => void;
}
declare const LeaveEdit: ({ leave, onUpdated, isOpen, onClose }: Props) => import("react").JSX.Element | null;
export default LeaveEdit;
