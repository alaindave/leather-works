import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, Text, HStack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { FaSyncAlt } from "react-icons/fa";
import { useState } from "react";
export default function PayrollPage() {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(false);
    //Payroll sync and refresh
    const handlePayrollSync = async () => {
        // try {
        //   setLoading(true);
        //   const result = await window.electron.sync();
        //   if (result.success) {
        //     console.log("Sync completed");
        //     const leaves = await window.electron.leave.getLeaveByMonth(
        //       submissionMonth
        //     );
        //     setLeaves(leaves);
        //     console.log(
        //       `Fetched leaves for the month of ${submissionMonth}:${leaves}`
        //     );
        //   } else {
        //     console.error(result.message);
        //   }
        // } finally {
        //   setLoading(false);
        // }
    };
    return (_jsxs(Flex, { width: "100%", justify: "space-between", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Text, { color: "#1F2937", fontSize: "clamp(1.3rem, 1vw + 0.8rem, 1.4rem)", fontWeight: "700", ml: "0.5rem", mt: "0.7rem", children: "Fiches de paye" }), _jsx(Button, { bg: "transparent", isLoading: loading, color: "gray.800", _hover: { bg: "transparent" }, fontSize: "1rem", position: "relative", bottom: "0.2rem", right: "1rem", onClick: handlePayrollSync, children: _jsx(FaSyncAlt, {}) })] }), _jsx(Text, { fontWeight: "500", left: "0.45rem", fontSize: "clamp(1rem, 1vw + 0.8rem, 1.1rem)", color: "gray.500", position: "relative", bottom: "1.4rem", children: "G\u00E9rez les fiches de payes" })] }), _jsx(Button, { mt: "2rem", children: "Generer fiches de paye" }), _jsx(Box, { mt: "1rem", mr: "2rem", children: _jsx(Link, { to: "/employees_admin/payroll/settings", children: _jsx(IoSettings, { fontSize: "1.7rem" }) }) })] }));
}
