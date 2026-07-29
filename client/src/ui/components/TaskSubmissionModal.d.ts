import AdminUser from "../../common/types/AdminUser";
import User from "../../common/types/User";
interface Props {
    author: Omit<User, "password" | "notes">;
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
    adminUsersList: AdminUser[];
}
declare const TaskSubmissionModal: ({ author, isOpen, onClose, onRefresh, adminUsersList, }: Props) => import("react").JSX.Element;
export default TaskSubmissionModal;
