import { create } from "zustand";
import { persist } from "zustand/middleware";
import AdminUser from "../shared/types/AdminUser";

interface AdminUserStore {
  adminUser: Omit<AdminUser, "password" | "notes">;
  isAuthenticated: boolean;
  login: (
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: "manager" | "admin"
  ) => void;
  logout: () => void;
}

const useAdminUser = create<AdminUserStore>()(
  persist(
    (set) => ({
      adminUser: {} as AdminUser,
      isAuthenticated: false,
      login: (_id, firstName, lastName, email, role) => {
        set({
          adminUser: {
            _id,
            firstName,
            lastName,
            email,
            role,
          },
          isAuthenticated: true,
        });
      },

      logout: () =>
        set(() => ({
          adminUser: {} as AdminUser,
          isAuthenticated: false,
        })),
    }),
    {
      name: "employee-auth",
    }
  )
);
export default useAdminUser;
