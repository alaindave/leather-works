import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, HStack, Text, MenuButton, MenuList, MenuItem, Menu, Button, List, ListItem, Divider, useBreakpointValue, } from "@chakra-ui/react";
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import { FaFileSignature, FaRegClock } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { MdPersonOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import "../styles/App.css";
import Logo from "./Logo";
import useAdminUser from "../../store/auth.store";
import { ErrorBoundary } from "react-error-boundary";
import PageErrorFallback from "../pages/PageErrorFallback";
import { checkOnline } from "../services/connectivity_check.service";
import { useEffect, useState } from "react";
const EmployeeNavBar = () => {
    const adminUser = useAdminUser((store) => store.adminUser);
    const setLogOut = useAdminUser((store) => store.logout);
    const navigate = useNavigate();
    const [online, setOnline] = useState(false);
    useEffect(() => {
        async function check() {
            const result = await checkOnline();
            setOnline(result);
        }
        check();
    }, []);
    const sidebarWidth = useBreakpointValue({
        base: "15rem",
        md: "17rem",
        lg: "18rem",
    });
    const handleLogOut = async () => {
        try {
            const logout = await window.electron.auth.logout();
            if (logout) {
                setLogOut();
                navigate("/", { replace: true });
            }
        }
        catch (error) {
            console.error("An error occured while logging out:", error);
        }
    };
    return (_jsxs(Flex, { position: "relative", direction: "column", height: "95.1vh", width: sidebarWidth, bg: "#F8F9FB", borderRight: "1px solid", borderColor: "#D1D9E0", boxShadow: "2px 0 8px rgba(0,0,0,0.04)", borderRadius: "0", justify: "space-between", children: [_jsx(Flex, { position: "relative", left: "0.4rem", children: _jsx(Box, { padding: "10px", children: _jsx(Logo, { text: "Gestion de personnel" }) }) }), _jsx(Box, { position: "relative", left: "1rem", children: _jsxs(List, { children: [_jsx(ListItem, { marginBottom: "10px", children: _jsx(HStack, { position: "relative", right: "1.5rem", children: _jsx(NavLink, { className: "nav-button", end: true, to: "/employees_admin", children: _jsxs(HStack, { children: [_jsx(Box, { ml: "1rem", children: _jsx(FaHome, { size: "1.4rem" }) }), _jsx(Text, { mt: "1rem", fontSize: "1.3rem", children: "Tableau de bord" })] }) }) }) }), _jsx(ListItem, { marginBottom: "10px", children: _jsx(HStack, { position: "relative", right: "1.5rem", children: _jsx(ErrorBoundary, { FallbackComponent: PageErrorFallback, children: _jsx(NavLink, { to: "/employees_admin/employees_list", className: "nav-button", children: _jsxs(HStack, { children: [_jsx(Box, { ml: "1rem", children: _jsx(IoPeopleSharp, { size: "1.4rem" }) }), _jsx(Text, { mt: "1rem", fontSize: "1.3rem", children: "Employ\u00E9s" })] }) }) }) }) }), _jsx(ListItem, { marginBottom: "10px", children: _jsx(HStack, { position: "relative", right: "1.5rem", children: _jsx(ErrorBoundary, { FallbackComponent: PageErrorFallback, children: _jsx(NavLink, { className: "nav-button", to: "/employees_admin/attendances", children: _jsxs(HStack, { children: [_jsx(Box, { ml: "1rem", children: _jsx(FaRegClock, { size: "1.4rem" }) }), _jsx(Text, { mt: "1rem", fontSize: "1.3rem", children: "Pr\u00E9sence" })] }) }) }) }) }), _jsx(ListItem, { marginBottom: "10px", children: _jsx(HStack, { position: "relative", right: "1.5rem", children: _jsx(ErrorBoundary, { FallbackComponent: PageErrorFallback, children: _jsx(NavLink, { className: "nav-button", to: "/employees_admin/leaves", children: _jsxs(HStack, { children: [_jsx(Box, { ml: "1rem", children: _jsx(FaRegCalendarAlt, { size: "1.4rem" }) }), _jsx(Text, { mt: "1rem", fontSize: "1.3rem", children: "Cong\u00E9s" })] }) }) }) }) }), _jsx(ListItem, { marginBottom: "10px", children: _jsx(HStack, { position: "relative", right: "1.4rem", children: _jsx(NavLink, { className: "nav-button", to: "/employees_admin/payroll", children: _jsxs(HStack, { children: [_jsx(Box, { ml: "1rem", children: _jsx(FaFileSignature, { size: "1.4rem" }) }), _jsx(Text, { mt: "1rem", fontSize: "1.3rem", children: "Fiches de paye" })] }) }) }) }), _jsx(ListItem, { marginBottom: "10px", children: _jsx(HStack, { position: "relative", right: "1.4rem", children: _jsx(NavLink, { className: "nav-button", to: "/admin", children: _jsxs(HStack, { children: [_jsx(Box, { ml: "1rem", children: _jsx(IoStatsChartSharp, { size: "1.4rem" }) }), _jsx(Text, { mt: "1rem", fontSize: "1.3rem", children: "Rapports" })] }) }) }) }), _jsx(ListItem, { marginBottom: "20px", children: _jsx(HStack, { position: "relative", right: "1.4rem", children: _jsx(NavLink, { className: "nav-button", to: "/admin", children: _jsxs(HStack, { children: [_jsx(Box, { ml: "1rem", children: _jsx(FaFileSignature, { size: "1.4rem" }) }), _jsx(Text, { mt: "1rem", fontSize: "1.3rem", children: "Taches" })] }) }) }) })] }) }), _jsxs(Flex, { position: "absolute", bottom: "0.4rem", border: "1px solid #E2E8F0", bg: "gray.100", boxShadow: "0 2px 10px rgba(15,23,42,.06)", borderRadius: "0.5rem", height: "3.9rem", width: sidebarWidth, justify: "space-evenly", children: [_jsx(Flex, { height: "40px", width: "40px", borderWidth: "2px", borderRadius: "20px", bg: "#ffffff", borderColor: "blue", justifyContent: "center", alignItems: "center", ml: "0.2rem", mt: "0.5rem", children: _jsx(MdPersonOutline, { color: "blue", size: "2rem" }) }), _jsxs(Box, { children: [_jsxs(Text, { mt: "0.2rem", color: "gray.800", fontSize: "1rem", fontWeight: 700, padding: "2px", children: [adminUser?.firstName, " ", adminUser?.lastName] }), _jsx(Text, { position: "relative", bottom: "1.1rem", color: "gray.600", fontWeight: "500", children: adminUser?.email })] }), _jsx(Box, { position: "relative", bottom: "7px", width: "20px", children: _jsxs(Menu, { children: [_jsx(MenuButton, { position: "relative", right: "20px", background: "transparent", color: "#374151", _hover: { bg: "transparent" }, as: Button, rightIcon: _jsx(IoIosArrowDown, { size: "18px" }) }), _jsxs(MenuList, { bg: "gray.500", position: "relative", right: "200px", children: [_jsxs(MenuItem, { bg: "gray.500", _hover: { bg: "#e68a00" }, children: [_jsx(FaUserAlt, { color: "#ffffff" }), _jsx(Text, { color: "#ffffff", mt: "0.8rem", ml: "0.8rem", children: "Mon profil" })] }), _jsxs(MenuItem, { bg: "gray.500", _hover: { bg: "#e68a00" }, children: [_jsx(IoSettings, { color: "#ffffff" }), _jsx(Text, { color: "#ffffff", mt: "0.8rem", ml: "0.8rem", children: "Parametres" })] }), _jsxs(MenuItem, { bg: "gray.500", _hover: { bg: "#e68a00" }, onClick: handleLogOut, children: [_jsx(FaSignOutAlt, { color: "#ffffff" }), _jsx(Text, { color: "#ffffff", mt: "0.8rem", ml: "0.8rem", children: "Deconnection" })] })] })] }) })] }), _jsxs(Flex, { position: "relative", top: "3rem", width: "100vw", height: "6.5vh", bg: "gray.200", justify: "space-between", children: [_jsx(Text, { ml: "1rem", mt: "0.4rem", fontSize: "1rem", color: "gray.800", children: "Afritan-Gestion de personnel" }), _jsxs(HStack, { mt: "0.3rem", mr: "2rem", fontSize: "1rem", color: "gray.600", children: [_jsx(Text, { color: "gray.800", children: "Version 1.0.0" }), _jsx(Divider, { orientation: "vertical", h: "1.3rem", borderColor: "gray.500" }), _jsxs(HStack, { children: [_jsx(Box, { color: "green.600", position: "relative", left: "0.4rem", bottom: "0.4rem", children: _jsx(GoDotFill, { size: "1.3rem" }) }), _jsx(Text, { color: "gray.800", children: online ? "Connecté" : "Deconnecté" })] })] })] })] }));
};
export default EmployeeNavBar;
