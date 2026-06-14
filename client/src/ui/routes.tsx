import { createHashRouter } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import App from "./App";
import EmployeeAdminPage from "./pages/EmployeeAdminPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import EmployeeAdminLayout from "./components/EmployeeAdminLayout";
import EmployeeLeavePage from "./pages/EmployeeLeavePage";
import EmployeeAttendancePage from "./pages/EmployeeAttendancePage";
import ComponentErrorFallback from "./pages/ComponentErrorFallback";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ComponentErrorFallback />,
  },

  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ComponentErrorFallback />,
  },

  {
    path: "/employees_admin",
    element: <EmployeeAdminLayout />,
    children: [
      {
        path: "",
        element: <EmployeeAdminPage />,
        errorElement: <ComponentErrorFallback />,
      },

      {
        path: "employees_list",
        element: <EmployeeListPage />,
        errorElement: <ComponentErrorFallback />,
      },
      {
        path: "employees_list/:_id",
        element: <EmployeeDetailsPage />,
        errorElement: <ComponentErrorFallback />,
      },
      {
        path: "attendances",
        element: <EmployeeAttendancePage />,
        errorElement: <ComponentErrorFallback />,
      },

      {
        path: "leaves",
        element: <EmployeeLeavePage />,
        errorElement: <ComponentErrorFallback />,
      },
    ],
  },
]);

export default router;
