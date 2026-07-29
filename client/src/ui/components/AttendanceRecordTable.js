import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, } from "@chakra-ui/react";
import { formatLateMinutes } from "./ClockIn";
const getStatusColor = (status) => {
    switch (status) {
        case "PONCTUEL":
            return "green";
        case "RETARD":
            return "orange";
        case "ABSENT":
            return "red";
        case "CONGÉ":
            return "purple";
        default:
            return "gray";
    }
};
export default function AttendanceTable({ records }) {
    return (_jsx(TableContainer, { borderWidth: "1px", borderRadius: "xl", bg: "white", boxShadow: "sm", overflowY: "auto", maxH: "450px", children: _jsxs(Table, { variant: "simple", size: "md", children: [_jsx(Thead, { position: "sticky", top: 0, zIndex: 1, bg: "gray.50", children: _jsxs(Tr, { children: [_jsx(Th, { children: "Date" }), _jsx(Th, { children: "Pointage entr\u00E9e" }), _jsx(Th, { children: "Pointage sortie" }), _jsx(Th, { children: "Statut" }), _jsx(Th, { children: "Minutes de retard" }), _jsx(Th, { children: "Notes" })] }) }), _jsx(Tbody, { children: records.map((record) => (_jsxs(Tr, { children: [_jsx(Td, { children: new Date(record.date).toLocaleDateString("fr-FR") }), _jsx(Td, { children: record.clockIn ? (new Date(record.clockIn).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })) : (_jsx(Text, { color: "gray.400", children: "\u2014" })) }), _jsx(Td, { children: record.clockOut ? (new Date(record.clockOut).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })) : (_jsx(Text, { color: "gray.400", children: "\u2014" })) }), _jsx(Td, { children: _jsx(Badge, { bg: getStatusColor(record.status), color: "#ffffff", px: 3, py: 1, borderRadius: "full", fontSize: "0.7rem", children: record.status }) }), _jsx(Td, { children: record.lateMinutes && formatLateMinutes(record.lateMinutes) }), _jsx(Td, { children: record.lateNotes })] }, record._id))) })] }) }));
}
