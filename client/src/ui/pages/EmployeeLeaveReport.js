import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeaveHistoryTable from "../components/LeaveHistoryTable";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineChevronRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
const EmployeeLeaveReport = () => {
    const location = useLocation();
    const { employee } = location.state || {};
    const { photo_url } = location.state || "";
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        async function getLeaveHistory() {
            if (!employee?._id)
                return;
            const leaves = await window.electron.leave.getLeaveByEmployeeId(employee?._id);
            console.log("Leave history fetched:", leaves);
            setLeaves(leaves);
        }
        getLeaveHistory();
    }, []);
    return (_jsxs(Flex, { direction: "column", bg: "#ffffff", width: "100%", alignItems: "flex-start", children: [_jsxs(HStack, { mt: "1.4rem", children: [_jsx(Link, { to: {
                            pathname: `/employees_admin/employees_list/${employee?._id}`,
                        }, state: { photo_url }, children: _jsx(Box, { ml: "0.8rem", mb: "2rem", p: 2, border: "1px solid #14376b", borderRadius: "10px", children: _jsx(FaArrowLeftLong, { color: "black" }) }) }), _jsx(Box, { mt: "0.5rem", children: _jsxs(HStack, { ml: "0.3rem", position: "relative", bottom: "1rem", children: [_jsx(Text, { fontSize: "1.1rem", fontWeight: "500", children: "Employ\u00E9s" }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsxs(Text, { fontSize: "1.1rem", fontWeight: "500", children: [" ", employee?.firstName, " ", employee?.lastName] }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsx(Text, { fontSize: "1.1rem", fontWeight: "500", children: "Cong\u00E9s" })] }) })] }), leaves.length != 0 ? (_jsx(LeaveHistoryTable, { leaves: leaves })) : (_jsx(Text, { fontSize: "1.7rem", color: "gray.800", position: "relative", left: "20rem", top: "15rem", children: "Pas de cong\u00E9s \u00E0 afficher" }))] }));
};
export default EmployeeLeaveReport;
