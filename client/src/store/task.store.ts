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

    /*
     * Optimistically add a populated comment.
     * This makes the UI update immediately.
     */
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
      /*
       * Save only the author ID to SQLite.
       */
      await window.electron.taskComments.create({
        taskId,
        author: author._id,
        comment,
      });

      /*
       * IMPORTANT:
       *
       * Do NOT put the result of taskComments.create()
       * directly into task.comments.
       *
       * create() returns the raw database comment:
       *
       * {
       *   author: "admin-id"
       * }
       *
       * But the UI expects:
       *
       * {
       *   author: {
       *     _id: "admin-id",
       *     firstName: "Alain",
       *     lastName: "Bedetse"
       *   }
       * }
       *
       * Therefore reload the complete task, which uses
       * getTaskCommentsWithAuthor().
       */
      const refreshedTask = await window.electron.tasks.getById(taskId);

      if (!refreshedTask) {
        throw new Error(
          `Task ${taskId} could not be reloaded after adding comment`
        );
      }

      /*
       * Replace the stale task in Zustand with the
       * fully populated task.
       */
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? refreshedTask : task
        ),
      }));
    } catch (error) {
      /*
       * Remove optimistic comment if saving/reloading failed.
       */
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
