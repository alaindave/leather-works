import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VStack, Text, Flex, Box } from "@chakra-ui/react";
import { TiDeleteOutline } from "react-icons/ti";
const TaskCard = ({ task, onTaskClick, onTaskDelete }) => {
    return (_jsxs(VStack, { bg: task.isResolved ? "green.200" : "red.200", border: "1px solid black", borderRadius: "0.4rem", mb: "0.4rem", height: "6rem", pb: 2, borderColor: "#D1D9E0", boxShadow: "0 2px 8px rgba(1,0,1,1)", width: "25rem", cursor: "pointer", _hover: {
            transform: "translateY(-2px)",
            shadow: "md",
        }, children: [_jsxs(Flex, { justify: "space-between", width: "25rem", children: [_jsx(Box, { fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "800", mt: "0.4rem", ml: "0.4rem", onClick: () => onTaskClick(task), cursor: "pointer", children: task.taskNumber }), _jsx(Text, { mt: "0.4rem", children: task.author.firstName }), _jsx(Box, { fontSize: "1.2rem", fontWeight: "800", mt: "0.3rem", mr: "0.5rem", cursor: "pointer", onClick: () => onTaskDelete(task._id), children: _jsx(TiDeleteOutline, {}) })] }), _jsxs(Flex, { width: "25rem", justifyContent: "space-between", children: [_jsx(Text, { ml: "0.4rem", color: "gray.700", fontSize: "1.1rem", fontWeight: "500", children: task.subject }), _jsx(Text, { mr: "1rem", children: new Date(task.deadline).toLocaleDateString("fr-FR") })] })] }));
};
export default TaskCard;
