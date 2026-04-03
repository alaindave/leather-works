import { createBrowserRouter } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import App from "./App";
import EmployeeAdminPage from "./components/EmployeeAdminPage";
import EmployeeList from "./components/EmployeeList";
import EmployeeDetails from "./components/EmployeeDetails";

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
    path: "/employees_admin",
    element: <EmployeeAdminPage />,
  },

  {
    path: "/employees_admin/employees_list",
    element: <EmployeeList />,
  },
  {
    path: "/employees_admin/employees_list/:id",
    element: <EmployeeDetails />,
  },
]);

export default router;
