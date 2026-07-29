import User from "../common/types/User";
interface AdminUserStore {
    adminUser: Omit<User, "password">;
    isAuthenticated: boolean;
    login: (_id: string, firstName: string, lastName: string, email: string, role: "manager" | "admin", notes: string) => void;
    logout: () => void;
    saveNotes: (notes: string) => void;
}
declare const useAdminUser: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AdminUserStore>, "setState" | "persist"> & {
    setState(partial: AdminUserStore | Partial<AdminUserStore> | ((state: AdminUserStore) => AdminUserStore | Partial<AdminUserStore>), replace?: false | undefined): unknown;
    setState(state: AdminUserStore | ((state: AdminUserStore) => AdminUserStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AdminUserStore, AdminUserStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AdminUserStore) => void) => () => void;
        onFinishHydration: (fn: (state: AdminUserStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AdminUserStore, AdminUserStore, unknown>>;
    };
}>;
export default useAdminUser;
