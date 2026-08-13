import { create } from "zustand";
import Task from "../common/types/Task";
import PopulatedTaskComment from "../common/types/PopulatedTaskComment";
import User from "../common/types/User";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  loadAllTasks: () => Promise<void>;
  loadTopTasks: (userId: string) => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => void;
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

      console.log("LOADED TASKED:", tasks);

      set({
        tasks,
        loading: false,
      });
    } catch (error) {
      console.error("AN ERROR OCCURED WHILE LOADING TASKS IN ZUSTAND", error);

      set({ loading: false });
    }
  },

  loadTopTasks: async (userId: string) => {
    set({ loading: true });

    try {
      const tasks = await window.electron.tasks.getTopTasks(userId);

      console.log("LOADED TOP TASKS IN STORE:", tasks);

      set({
        tasks,
        loading: false,
      });
    } catch (error) {
      console.error(
        "AN ERROR OCCURED WHILE LOADING TOP TASKS IN ZUSTAND.",
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
        "AN ERROR OCCURED WHILE CREATING THE TASK IN ZUSTAND.",
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
        "AN ERROR OCCURED WHILE UPDATING THE TASK IN ZUSTAND.",
        error
      );
    }
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== taskId),
    }));
  },

  addComment: async (taskId, author, comment) => {
    const tempId = crypto.randomUUID();
    const optimisticComment: PopulatedTaskComment = {
      _id: tempId,
      taskId,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      author: {
        _id: author._id,
        firstName: author.firstName ?? "",
        lastName: author.lastName ?? "",
      },
    };

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id !== taskId
          ? task
          : {
              ...task,
              comments: [...(task.comments ?? []), optimisticComment],
            }
      ),
    }));

    try {
      await window.electron.taskComments.create({
        taskId,
        author: author._id,
        comment,
      });
      const refreshedTask = await window.electron.tasks.getById(taskId);

      if (!refreshedTask) {
        throw new Error(
          `Task ${taskId} could not be reloaded after adding comment`
        );
      }
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? refreshedTask : task
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
      throw error;
    }
  },
}));

export default useTaskStore;
