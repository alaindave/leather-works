import { createBrowserRouter } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import App from "./App";
import EmployeeAdminPage from "./pages/EmployeeAdminPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetails from "./pages/EmployeeDetailsPage";
import EmployeeAdminLayout from "./components/EmployeeAdminLayout";
import ErrorPage from "./pages/ErrorPage";
import React from "react";
import EmployeeAttendance from "./pages/EmployeeAttendance";

const router = createBrowserRouter([
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
        path: "attendance",
        element: <EmployeeAttendance />,
      },
    ],
  },
]);

export default router;
