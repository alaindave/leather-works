import { create } from "zustand";
import { persist } from "zustand/middleware";
const useAdminUser = create()(persist((set) => ({
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
    logout: () => set(() => ({
        adminUser: null,
        isAuthenticated: false,
    })),
}), {
    name: "employee-auth",
}));
export default useAdminUser;
