import { create } from "zustand";
import Task from "../shared/types/Task";
import PopulatedTaskComment from "../shared/types/PopulatedTaskComment";
import User from "../shared/types/User";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  // Actions
  loadAllTasks: () => Promise<void>;
  loadTopTasks: (userId: string) => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  addComment: (
    taskId: string,
    author: Omit<User, "password">,
    message: string
  ) => Promise<void>;

  setTasks: (tasks: Task[]) => void;
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,

  setTasks: (tasks) => set({ tasks }),

  loadAllTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await window.electron.tasks.getAll();
      console.log("Loaded tasks in store:", tasks);
      set({
        tasks,
        loading: false,
      });
    } catch (error) {
      console.error("An error occured while loading tasks in Zustand", error);
      set({ loading: false });
    }
  },

  loadTopTasks: async (userId: string) => {
    set({ loading: true });
    try {
      const tasks = await window.electron.tasks.getTopTasks(userId);
      console.log("Loaded top tasks in store:", tasks);
      set({
        tasks,
        loading: false,
      });
    } catch (error) {
      console.error(
        "An error occured while loading top tasks in Zustand",
        error
      );
      set({ loading: false });
    }
  },

  createTask: async (taskData) => {
    const optimisticTask: Task = {
      ...taskData,
      _id: crypto.randomUUID(),
      comments: [],
    } as Task;

    set((state) => ({
      tasks: [optimisticTask, ...state.tasks],
    }));

    try {
      const savedTask = await window.electron.tasks.create(taskData);

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === optimisticTask._id ? savedTask : t
        ),
      }));
    } catch (error) {
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== optimisticTask._id),
      }));

      console.error(
        "An error occured while creating the task in Zustand",
        error
      );
    }
  },

  updateTask: async (updatedTask) => {
    const previous = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      ),
    }));

    try {
      await window.electron.tasks.update(updatedTask);
    } catch (error) {
      set({ tasks: previous });
      console.error(
        "An error occured while updating the task in Zustand",
        error
      );
    }
  },

  deleteTask: async (taskId) => {
    const previous = get().tasks;

    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    }));

    try {
      await window.electron.tasks.delete(taskId);
    } catch (err) {
      set({ tasks: previous });

      console.error("An error occured while deleting the task", err);
    }
  },

  addComment: async (taskId, author, comment) => {
    const tempId = crypto.randomUUID();
    const optimisticComment: PopulatedTaskComment = {
      _id: tempId,
      taskId,
      comment,
      createdAt: new Date().toISOString(),
      author: {
        _id: author._id,
        firstName: author.firstName,
        lastName: author.lastName,
      },
    };
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id !== taskId
          ? task
          : {
              ...task,
              comments: [...task.comments!, optimisticComment],
            }
      ),
    }));

    try {
      const savedComment = await window.electron.taskComments.create({
        taskId,
        author: author._id,
        comment,
      });

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id !== taskId
            ? task
            : {
                ...task,
                comments: task.comments?.map((c) =>
                  c._id === tempId ? savedComment : c
                ),
              }
        ),
      }));
    } catch (error) {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id !== taskId
            ? task
            : {
                ...task,
                comments: task.comments?.filter((c) => c._id !== tempId),
              }
        ),
      }));

      console.error("An error occured while saving the comment", error);
    }
  },
}));

export default useTaskStore;
