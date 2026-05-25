import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "manager" | "admin";
}

interface AdminUserStore {
  adminUser: AdminUserData | null;
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
      adminUser: null,
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
          adminUser: null,
          isAuthenticated: false,
        })),
    }),
    {
      name: "employee-auth",
    }
  )
);
export default useAdminUser;
