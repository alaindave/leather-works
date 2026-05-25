import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";
const EmployeeAdminLayout = () => {
    return (_jsxs(Flex, { margin: "0", height: "100vh", width: "100vw", bgGradient: "radial(#47370b, #061962)", overflowY: "hidden", overflowX: "hidden", children: [_jsx(Box, { position: "relative", top: "2.5rem", left: "0.1rem", children: _jsx(EmployeeNavBar, {}) }), _jsx(Outlet, {})] }));
};
export default EmployeeAdminLayout;
