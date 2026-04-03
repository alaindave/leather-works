import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import App from "./App";
import EmployeePage from "./components/EmployeePage";
import EmployeeDashboard from "./components/EmployeeDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/admin",
    element: <AdminPage />,
  },

  {
    path: "/employees",
    element: <EmployeePage />,
  },

  {
    path: "/employees/dashboard",
    element: <EmployeeDashboard />,
  },
]);

export default router;
