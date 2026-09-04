import { create } from "zustand";
import { persist } from "zustand/middleware";
import User from "../common/types/User";

interface AdminUserStore {
  adminUser: Omit<User, "password">;
  isAuthenticated: boolean;

  login: (user: Omit<User, "password">) => void;

  logout: () => void;

  saveNotes: (notes: string) => void;
}

const emptyAdminUser = {} as Omit<User, "password">;

const useAdminUser = create<AdminUserStore>()(
  persist(
    (set) => ({
      adminUser: emptyAdminUser,
      isAuthenticated: false,

      login: (user) => {
        set({
          adminUser: user,
          isAuthenticated: true,
        });
      },

      logout: () =>
        set({
          adminUser: emptyAdminUser,
          isAuthenticated: false,
        }),

      saveNotes: (notes: string) =>
        set((state) => ({
          adminUser: {
            ...state.adminUser,
            notes,
          },
        })),
    }),
    {
      name: "employee-auth",
    }
  )
);

export default useAdminUser;
