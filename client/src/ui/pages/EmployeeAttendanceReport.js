import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, VStack, Image, Spacer, } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import defaultAvatar from "../assets/default-avatar.jpeg";
import AttendanceTable from "../components/AttendanceRecordTable";
import { useEffect, useState } from "react";
const EmployeeAttendanceReport = () => {
    const location = useLocation();
    const { employee } = location.state || {};
    const { photo_url } = location.state || "";
    const { attendance } = location.state || {};
    const [attendances, setAttendances] = useState([]);
    useEffect(() => {
        async function getAttendanceHistory() {
            if (!employee?._id)
                return;
            const attendances = await window.electron.attendance.getByEmployee(employee?._id);
            setAttendances(attendances);
        }
        getAttendanceHistory();
    }, []);
    return (_jsxs(Flex, { bg: "#ffffff", width: "100%", direction: "column", alignItems: "flex-start", children: [_jsxs(HStack, { mt: "0.6rem", children: [_jsx(Link, { to: {
                            pathname: `/employees_admin/employees_list/${employee?._id}`,
                        }, state: { photo_url }, children: _jsx(Box, { ml: "1rem", mb: "2rem", p: 2, border: "1px solid #14376b", borderRadius: "10px", children: _jsx(FaArrowLeftLong, { color: "black" }) }) }), _jsxs(Box, { mt: "0.3rem", children: [_jsx(Text, { ml: "1rem", fontSize: "1.4rem", fontWeight: "600", children: "Details de pr\u00E9sence" }), _jsxs(HStack, { ml: "1rem", position: "relative", bottom: "1rem", children: [_jsx(Text, { children: "Employ\u00E9s" }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsxs(Text, { children: [" ", employee?.firstName, " ", employee?.lastName] }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsx(Text, { children: "Pr\u00E9sence" })] })] })] }), _jsxs(Flex, { children: [_jsxs(Flex, { bg: "#F8F9FB", border: "1px solid", borderColor: "#D1D9E0", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", ml: "5rem", height: "13rem", width: "30rem", children: [_jsx(Image, { src: photo_url || defaultAvatar, boxSize: "8rem", borderRadius: "full", objectFit: "cover", mt: "1rem", ml: "0.5rem" }), _jsxs(VStack, { ml: "1rem", children: [_jsxs(HStack, { mt: "0.2rem", w: "120px", children: [_jsx(Text, { fontWeight: "600", fontSize: "1.2rem", children: employee?.firstName }), _jsx(Text, { fontWeight: "600", fontSize: "1.2rem", children: employee?.lastName })] }), _jsxs(HStack, { w: "120px", children: [_jsx(Text, { color: "gray.600", fontSize: "1.1rem", children: "Matricule:" }), _jsx(Text, { color: "gray.800", fontSize: "1rem", children: employee?.matricule })] }), _jsxs(HStack, { w: "120px", children: [_jsx(Text, { color: "gray.600", fontSize: "1.1rem", children: "Poste:" }), _jsx(Text, { color: "gray.800", fontSize: "1rem", children: employee?.role })] }), _jsxs(HStack, { w: "120px", children: [_jsx(Text, { color: "gray.600", fontSize: "1.1rem", children: "Departement:" }), _jsx(Text, { color: "gray.800", fontSize: "1rem", children: employee?.department })] })] })] }), _jsxs(Flex, { direction: "column", bg: "#F8F9FB", border: "1px solid", borderColor: "#D1D9E0", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", ml: "3rem", height: "13rem", width: "22rem", children: [_jsxs(Text, { fontWeight: "600", fontSize: "1.1rem", ml: "1rem", mt: "0.5rem", children: ["Aujurdui-", new Date().toLocaleDateString("fr-FR", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short",
                                    })] }), _jsxs(HStack, { mt: "0.5rem", ml: "1rem", bg: attendance?.clockIn && attendance.status == "PONCTUEL"
                                    ? "green.100"
                                    : "red.100", borderRadius: "0.2rem", height: "2rem", width: "20rem", children: [_jsx(Box, { mt: "1rem", color: attendance?.clockIn && attendance.status == "PONCTUEL"
                                            ? "green.600"
                                            : "red.600", fontSize: "1.4rem", position: "relative", bottom: "0.5rem", children: _jsx(GoDotFill, {}) }), _jsx(Text, { mt: "0.8rem", color: attendance?.clockIn && attendance.status == "PONCTUEL"
                                            ? "green.600"
                                            : "red.600", fontWeight: "600", children: attendance?.status === "PONCTUEL"
                                            ? "A l'heure"
                                            : attendance?.status === "RETARD"
                                                ? "En retard"
                                                : attendance?.status === "CONGÉ"
                                                    ? "En congé"
                                                    : "Absent" })] }), _jsxs(HStack, { mt: "1.5rem", children: [_jsx(Text, { ml: "1rem", children: "Entr\u00E9e" }), _jsx(Spacer, {}), _jsx(Text, { mr: "1rem", color: attendance?.clockIn && attendance.status == "PONCTUEL"
                                            ? "green.600"
                                            : "red.600", children: attendance?.clockIn
                                            ? new Date(attendance?.clockIn).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "Pas de pointage" })] }), _jsxs(HStack, { mt: "0.5rem", children: [_jsx(Text, { ml: "1rem", children: "Sortie" }), _jsx(Spacer, {}), _jsx(Text, { mr: "1rem", color: attendance?.clockOut ? "purple.600" : "red.600", children: attendance?.clockOut
                                            ? new Date(attendance?.clockOut).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "Pas de pointage" })] })] })] }), _jsx(Box, { ml: "5rem", mt: "3rem", children: _jsx(AttendanceTable, { records: attendances }) })] }));
};
export default EmployeeAttendanceReport;
