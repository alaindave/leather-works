import { create } from "zustand";
import { persist } from "zustand/middleware";
import User from "../shared/types/User";

interface AdminUserStore {
  adminUser: Omit<User, "password">;
  isAuthenticated: boolean;
  login: (
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: "manager" | "admin",
    notes: string
  ) => void;
  logout: () => void;
  saveNotes: (notes: string) => void;
}

const useAdminUser = create<AdminUserStore>()(
  persist(
    (set) => ({
      adminUser: {} as Omit<User, "password">,
      isAuthenticated: false,
      login: (_id, firstName, lastName, email, role, notes) => {
        set({
          adminUser: {
            _id,
            firstName,
            lastName,
            email,
            role,
            notes,
          },
          isAuthenticated: true,
        });
      },

      logout: () =>
        set(() => ({
          adminUser: {} as Omit<User, "password">,
          isAuthenticated: false,
        })),

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
