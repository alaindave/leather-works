import { createHashRouter } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import App from "./App";
import EmployeeAdminPage from "./pages/EmployeeAdminPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetails from "./pages/EmployeeDetailsPage";
import EmployeeAdminLayout from "./components/EmployeeAdminLayout";
import ErrorPage from "./pages/ErrorPage";
import EmployeeLeavePage from "./pages/EmployeeLeavePage";
import EmployeeAttendancePage from "./pages/EmployeeAttendancePage";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/admin",
    element: <AdminPage />,
  },

  {
    path: "/employees_admin",
    element: <EmployeeAdminLayout />,
    children: [
      {
        path: "",
        element: <EmployeeAdminPage />,
      },

      {
        path: "employees_list",
        element: <EmployeeListPage />,
      },
      {
        path: "employees_list/:_id",
        element: <EmployeeDetails />,
      },
      {
        path: "attendances",
        element: <EmployeeAttendancePage />,
      },

      {
        path: "leaves",
        element: <EmployeeLeavePage />,
      },
    ],
  },
]);

export default router;
