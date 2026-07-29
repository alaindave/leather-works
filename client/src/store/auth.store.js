import { create } from "zustand";
import { persist } from "zustand/middleware";
const useAdminUser = create()(persist((set) => ({
    adminUser: {},
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
    logout: () => set(() => ({
        adminUser: {},
        isAuthenticated: false,
    })),
    saveNotes: (notes) => set((state) => ({
        adminUser: {
            ...state.adminUser,
            notes,
        },
    })),
}), {
    name: "employee-auth",
}));
export default useAdminUser;
