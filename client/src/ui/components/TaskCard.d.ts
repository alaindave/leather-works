import Task from "../../common/types/Task";
interface Props {
    task: Task;
    onTaskDelete: (_id: string) => void;
    onTaskClick: (task: Task) => void;
}
declare const TaskCard: ({ task, onTaskClick, onTaskDelete }: Props) => import("react").JSX.Element;
export default TaskCard;
