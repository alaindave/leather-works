import { createHashRouter } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import App from "./App";
import EmployeeAdminPage from "./pages/EmployeeAdminPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import EmployeeAdminLayout from "./components/EmployeeAdminLayout";
import EmployeeLeavePage from "./pages/EmployeeLeavePage";
import EmployeeAttendancePage from "./pages/EmployeeAttendancePage";
import PageErrorFallback from "./pages/PageErrorFallback";
import EmployeeAttendanceReport from "./pages/EmployeeAttendanceReport";
import EmployeeLeaveReport from "./pages/EmployeeLeaveReport";
import PayrollPage from "./pages/payroll/PayrollPage";
import EmployeePayslips from "./pages/EmployeePayslips";
import PayrollEmployeeProfileSettingsPage from "./pages/payroll/PayrollEmployeeProfileSettingsPage";
import PayrollSettingsPage from "./pages/payroll/PayrollSettingsPage";
import PayrollDetailsPage from "./pages/payroll/PayrollDetailsPage";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageErrorFallback />,
  },

  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <PageErrorFallback />,
  },

  {
    path: "/employees_admin",
    element: <EmployeeAdminLayout />,
    children: [
      {
        path: "",
        element: <EmployeeAdminPage />,
        errorElement: <PageErrorFallback />,
      },

      {
        path: "employees_list",
        element: <EmployeeListPage />,
        errorElement: <PageErrorFallback />,
      },
      {
        path: "employees_list/:_id",
        element: <EmployeeDetailsPage />,
        errorElement: <PageErrorFallback />,
      },

      {
        path: "employees_list/:_id/attendances",
        element: <EmployeeAttendanceReport />,
        errorElement: <PageErrorFallback />,
      },

      {
        path: "employees_list/:_id/leaves",
        element: <EmployeeLeaveReport />,
        errorElement: <PageErrorFallback />,
      },

      {
        path: "employees_list/:_id/payslips",
        element: <EmployeePayslips />,
        errorElement: <PageErrorFallback />,
      },
      {
        path: "employees_list/:_id/payslips/settings",
        element: <PayrollEmployeeProfileSettingsPage />,
        errorElement: <PageErrorFallback />,
      },

      {
        path: "attendances",
        element: <EmployeeAttendancePage />,
        errorElement: <PageErrorFallback />,
      },

      {
        path: "leaves",
        element: <EmployeeLeavePage />,
        errorElement: <PageErrorFallback />,
      },
      {
        path: "payroll",
        element: <PayrollPage />,
        errorElement: <PageErrorFallback />,
      },
      {
        path: "payroll/settings",
        element: <PayrollSettingsPage />,
        errorElement: <PageErrorFallback />,
      },
      {
        path: "payroll/details/:_id",
        element: <PayrollDetailsPage />,
        errorElement: <PageErrorFallback />,
      },
    ],
  },
]);

export default router;
