import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Text, } from "@chakra-ui/react";
import { MdOutlineChevronRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import PayrollEmployeeProfileList from "./PayrollEmployeeProfileList";
import { Link, useLocation } from "react-router-dom";
export default function PayrollEmployeeProfileSettingsPage() {
    const location = useLocation();
    const { employee } = location.state || {};
    const { photo_url } = location.state || "";
    return (_jsxs(Box, { p: 6, children: [_jsxs(HStack, { children: [_jsx(Link, { to: {
                            pathname: `/employees_admin/employees_list/${employee?._id}`,
                        }, state: { photo_url, employee }, children: _jsx(Box, { ml: "0.8rem", mb: "2rem", p: 2, border: "1px solid #14376b", borderRadius: "10px", children: _jsx(FaArrowLeftLong, { color: "black" }) }) }), _jsx(Box, { mt: "0.5rem", children: _jsxs(HStack, { ml: "0.3rem", position: "relative", bottom: "1rem", children: [_jsx(Text, { fontSize: "1.1rem", fontWeight: "500", children: "Employ\u00E9s" }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsxs(Text, { fontSize: "1.1rem", fontWeight: "500", children: [" ", employee?.firstName, " ", employee?.lastName] }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsx(Text, { fontSize: "1.1rem", fontWeight: "500", children: "Fiche de paye" }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsx(Text, { fontSize: "1.1rem", fontWeight: "500", children: "Parametres" })] }) })] }), _jsxs(Tabs, { colorScheme: "yellow", children: [_jsxs(TabList, { gap: "20rem", children: [_jsx(Tab, { children: "Remuneration" }), _jsx(Tab, { children: "Deductions" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { px: 0, children: _jsx(PayrollEmployeeProfileList, { employeeID: employee._id, type: "EARNING" }) }), _jsx(TabPanel, { px: 0, children: _jsx(PayrollEmployeeProfileList, { employeeID: employee._id, type: "DEDUCTION" }) })] })] })] }));
}
