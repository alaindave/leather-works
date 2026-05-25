import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import App from "./App";
import EmployeeAdminPage from "./pages/EmployeeAdminPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetails from "./pages/EmployeeDetailsPage";
import EmployeeAdminLayout from "./components/EmployeeAdminLayout";
import ErrorPage from "./pages/ErrorPage";
import EmployeeLeavePage from "./pages/EmployeeLeavePage";
import EmployeeAttendancePage from "./pages/EmployeeAttendancePage";
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(App, {}),
        errorElement: _jsx(ErrorPage, {}),
    },
    {
        path: "/admin",
        element: _jsx(AdminPage, {}),
    },
    {
        path: "/employees_admin",
        element: _jsx(EmployeeAdminLayout, {}),
        children: [
            {
                path: "",
                element: _jsx(EmployeeAdminPage, {}),
            },
            {
                path: "employees_list",
                element: _jsx(EmployeeListPage, {}),
            },
            {
                path: "employees_list/:_id",
                element: _jsx(EmployeeDetails, {}),
            },
            {
                path: "attendances",
                element: _jsx(EmployeeAttendancePage, {}),
            },
            {
                path: "leaves",
                element: _jsx(EmployeeLeavePage, {}),
            },
        ],
    },
]);
export default router;
