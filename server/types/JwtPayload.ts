export type Role = "ADMIN" | "HR" | "MANAGER";

export interface JwtPayload {
  _id: string;
  email: string;
  isAdmin: boolean;
  role: Role;
}
