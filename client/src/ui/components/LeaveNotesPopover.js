import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Text, } from "@chakra-ui/react";
const LeaveNotesPopover = ({ subject, notes }) => {
    return (_jsxs(Popover, { trigger: "hover", placement: "right", children: [_jsx(PopoverTrigger, { children: _jsx(Text, { color: "gray.600", fontWeight: "500", fontSize: "1.1rem", cursor: "pointer", _hover: {
                        color: "#F2B705",
                    }, whiteSpace: "normal", wordBreak: "break-word", maxW: "7.5rem", children: subject }) }), _jsxs(PopoverContent, { bg: "#F8F9FB", borderColor: "#22345F", color: "white", width: "320px", children: [_jsx(PopoverArrow, { bg: "#08162b" }), _jsx(PopoverBody, { children: _jsxs(Text, { color: "gray.800", fontSize: "1.1rem", whiteSpace: "normal", wordBreak: "break-word", noOfLines: 2, children: [_jsx("strong", { children: "Notes:" }), " ", notes] }) })] })] }));
};
export default LeaveNotesPopover;
