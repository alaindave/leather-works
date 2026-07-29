import Task from "../../common/types/Task";
interface Props {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
}
export default function TaskDetailsDrawer({ task, isOpen, onClose, onRefresh, }: Props): import("react").JSX.Element | null;
export {};
