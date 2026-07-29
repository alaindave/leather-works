import Task from "../common/types/Task";
import User from "../common/types/User";
interface TaskStore {
    tasks: Task[];
    loading: boolean;
    loadAllTasks: () => Promise<void>;
    loadTopTasks: (userId: string) => Promise<void>;
    createTask: (task: Task) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    addComment: (taskId: string, author: Omit<User, "password">, message: string) => Promise<void>;
    setTasks: (tasks: Task[]) => void;
}
declare const useTaskStore: import("zustand").UseBoundStore<import("zustand").StoreApi<TaskStore>>;
export default useTaskStore;
