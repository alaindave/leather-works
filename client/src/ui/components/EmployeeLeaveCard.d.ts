import { LeaveWithEmployee } from "../../common/types/LeaveWithEmployee";
interface Props {
    leave: LeaveWithEmployee;
    onDelete: () => void;
    gridTemplate: string;
}
declare const EmployeeLeaveCard: ({ leave, onDelete, gridTemplate }: Props) => import("react").JSX.Element;
export default EmployeeLeaveCard;
