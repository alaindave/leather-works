import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Text, } from "@chakra-ui/react";
const statusColor = (status) => {
    switch (status) {
        case "APPROUVÉ":
            return "green";
        case "REFUSÉ":
            return "red";
        case "EN ATTENTE D'APPROBATION":
            return "orange";
        case "ANNULÉ":
            return "gray";
        default:
            return "gray";
    }
};
export default function LeaveHistoryTable({ leaves }) {
    return (_jsx(TableContainer, { borderWidth: "1px", borderRadius: "lg", overflowX: "auto", bg: "white", shadow: "sm", mt: "2rem", ml: "2rem", children: _jsxs(Table, { variant: "simple", size: "sm", children: [_jsx(Thead, { bg: "gray.50", children: _jsxs(Tr, { children: [_jsx(Th, { children: "Soumis le" }), _jsx(Th, { children: "Debut de cong\u00E9" }), _jsx(Th, { children: "Fin de cong\u00E9" }), _jsx(Th, { children: "Motif" }), _jsx(Th, { children: "Notes" }), _jsx(Th, { children: "Statut" })] }) }), _jsx(Tbody, { children: leaves.map((leave) => (_jsxs(Tr, { children: [_jsx(Td, { children: new Date(leave.submittedAt).toLocaleDateString("fr-FR") }), _jsx(Td, { children: new Date(leave.startDate).toLocaleDateString("fr-FR") }), _jsx(Td, { children: new Date(leave.endDate).toLocaleDateString("fr-FR") }), _jsx(Td, { fontWeight: "medium", children: leave.subject }), _jsx(Td, { maxW: "300px", children: _jsx(Text, { mt: "1rem", noOfLines: 3, children: leave.notes }) }), _jsx(Td, { children: _jsx(Badge, { bg: statusColor(leave.status), color: "#ffffff", borderRadius: "full", px: 3, py: 1, textTransform: "capitalize", children: leave.status }) })] }, leave._id))) })] }) }));
}
