import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";
const EmployeeAdminLayout = () => {
    return (_jsxs(Flex, { height: "100vh", width: "100%", bg: "#F8FAFC", overflowY: "hidden", overflowX: "hidden", children: [_jsx(Box, { children: _jsx(EmployeeNavBar, {}) }), _jsx(Outlet, {})] }));
};
export default EmployeeAdminLayout;
