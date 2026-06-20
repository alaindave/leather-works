export interface AdminUserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "manager" | "admin";
}

export interface AdminUser extends AdminUserData {
  password: string;
  notes: string;
}
