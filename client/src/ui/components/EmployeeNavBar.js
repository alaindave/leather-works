import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, HStack, Text, MenuButton, MenuList, MenuItem, Menu, Button, List, ListItem, } from "@chakra-ui/react";
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import { FaFileSignature, FaRegClock } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { MdPersonOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
// @ts-ignore
import "../styles/App.css";
import Logo from "./Logo";
import useAdminUser from "../../store/authStore";
const EmployeeNavBar = () => {
    const adminUser = useAdminUser((store) => store.adminUser);
    const setLogOut = useAdminUser((store) => store.logout);
    const navigate = useNavigate();
    const handleLogOut = async () => {
        console.log("Log out initiated...");
        try {
            const logout = await window.electron.auth.logout();
            console.log("Result from main process log out request:", logout);
            if (logout) {
                setLogOut();
                navigate("/", {
                    replace: true,
                });
            }
        }
        catch (error) {
            console.error("An error occured while logging out:", error);
        }
    };
    return (_jsxs(Flex, { direction: "column", border: "none", marginTop: "10px", marginLeft: "2px", borderRadius: "20px", padding: "8px", background: "#03143B", height: "94vh", width: "280px", children: [_jsx(Box, { padding: "10px", position: "relative", right: "13px", children: _jsx(Logo, { text: "Gestion de personnel" }) }), _jsx(Box, { className: "nav-list", children: _jsxs(List, { children: [_jsx(ListItem, { marginBottom: "40px", children: _jsxs(HStack, { position: "relative", right: "30px", children: [_jsx(FaHome, { size: "1.8rem", color: "#C7D2FE" }), _jsx(NavLink, { className: "nav-button", end: true, to: "/employees_admin", children: "Tableau de bord" })] }) }), _jsx(ListItem, { marginBottom: "40px", children: _jsxs(HStack, { position: "relative", right: "30px", children: [_jsx(IoPeopleSharp, { size: "1.8rem", color: "#C7D2FE" }), _jsx(NavLink, { className: "nav-button", to: "/employees_admin/employees_list", children: "Employ\u00E9s" })] }) }), _jsx(ListItem, { marginBottom: "40px", children: _jsxs(HStack, { position: "relative", right: "30px", children: [_jsx(FaRegClock, { size: "1.8rem", color: "#C7D2FE" }), _jsx(NavLink, { className: "nav-button", to: "/employees_admin/attendances", children: "Pr\u00E9sence" })] }) }), _jsx(ListItem, { marginBottom: "40px", children: _jsxs(HStack, { position: "relative", right: "30px", children: [_jsx(FaRegCalendarAlt, { size: "1.8rem", color: "#C7D2FE" }), _jsx(NavLink, { className: "nav-button", to: "/employees_admin/leaves", children: "Cong\u00E9s" })] }) }), _jsx(ListItem, { marginBottom: "40px", children: _jsxs(HStack, { position: "relative", right: "30px", children: [_jsx(FaFileSignature, { size: "1.8rem", color: "#C7D2FE" }), _jsx(NavLink, { className: "nav-button", to: "/admin", children: "Fiches de paye" })] }) })] }) }), _jsxs(Flex, { borderWidth: "0.2px", borderColor: "gray", borderRadius: "15px", position: "relative", height: "60px", width: "277px", top: "278px", right: "7px", justify: "space-evenly", children: [_jsx(Flex, { height: "40px", width: "40px", borderWidth: "0.5px", borderRadius: "20px", bg: "#0b1e3a", borderColor: "#A9B4C2", position: "relative", top: "8px", justifyContent: "center", alignItems: "center", children: _jsx(MdPersonOutline, { color: adminUser?.role === "manager" ? "yellow" : "#ffffff", size: "25px" }) }), _jsxs(Box, { position: "relative", left: "8px", bottom: "16px", children: [_jsxs(Text, { color: "#ffffff", fontWeight: 700, position: "relative", top: "17px", padding: "2px", children: [adminUser?.firstName, " ", adminUser?.lastName] }), _jsx(Text, { color: "#A9B4C2", children: adminUser?.email })] }), _jsx(Box, { position: "relative", bottom: "7px", width: "20px", children: _jsxs(Menu, { children: [_jsx(MenuButton, { position: "relative", right: "20px", background: "transparent", color: "#ffffff", _hover: { bg: "transparent" }, as: Button, rightIcon: _jsx(IoIosArrowDown, { size: "18px" }) }), _jsxs(MenuList, { bg: "#08162b", position: "relative", right: "200px", children: [_jsxs(MenuItem, { bg: "#08162b", _hover: {
                                                background: "transparent",
                                                color: "#F2B705",
                                            }, children: [_jsx(FaUserAlt, { color: "#C7D2FE" }), _jsx(Text, { _hover: {
                                                        bg: "transparent",
                                                        color: "#f2b705",
                                                    }, position: "relative", left: "12px", top: "8px", color: "#ffffff", children: "Mon profil" })] }), _jsxs(MenuItem, { bg: "#08162b", _hover: {
                                                background: "transparent",
                                                color: "#F2B705",
                                            }, children: [_jsx(IoSettings, { color: "#C7D2FE" }), _jsx(Text, { _hover: {
                                                        bg: "transparent",
                                                        color: "#f2b705",
                                                    }, position: "relative", left: "12px", top: "8px", color: "#ffffff", children: "Parametres" })] }), _jsxs(MenuItem, { bg: "transparent", color: "#f2b705", borderRadius: "12px", _hover: {
                                                bg: "transparent",
                                            }, onClick: handleLogOut, children: [_jsx(FaSignOutAlt, { color: "#C7D2FE" }), _jsx(Text, { _hover: {
                                                        bg: "transparent",
                                                        color: "#f2b705",
                                                    }, position: "relative", left: "12px", top: "8px", color: "#ffffff", children: "Deconnection" })] })] })] }) })] })] }));
};
export default EmployeeNavBar;
