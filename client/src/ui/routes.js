import { jsx as _jsx } from "react/jsx-runtime";
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
const router = createHashRouter([
    {
        path: "/",
        element: _jsx(App, {}),
        errorElement: _jsx(PageErrorFallback, {}),
    },
    {
        path: "/admin",
        element: _jsx(AdminPage, {}),
        errorElement: _jsx(PageErrorFallback, {}),
    },
    {
        path: "/employees_admin",
        element: _jsx(EmployeeAdminLayout, {}),
        children: [
            {
                path: "",
                element: _jsx(EmployeeAdminPage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "employees_list",
                element: _jsx(EmployeeListPage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "employees_list/:_id",
                element: _jsx(EmployeeDetailsPage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "employees_list/:_id/attendances",
                element: _jsx(EmployeeAttendanceReport, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "employees_list/:_id/leaves",
                element: _jsx(EmployeeLeaveReport, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "employees_list/:_id/payslips",
                element: _jsx(EmployeePayslips, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "employees_list/:_id/payslips/settings",
                element: _jsx(PayrollEmployeeProfileSettingsPage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "attendances",
                element: _jsx(EmployeeAttendancePage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "leaves",
                element: _jsx(EmployeeLeavePage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "payroll",
                element: _jsx(PayrollPage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
            {
                path: "payroll/settings",
                element: _jsx(PayrollSettingsPage, {}),
                errorElement: _jsx(PageErrorFallback, {}),
            },
        ],
    },
]);
export default router;
