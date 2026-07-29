export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "manager" | "admin";
  notes: string;
}
