import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Text, } from "@chakra-ui/react";
const LeaveNotesPopover = ({ subject, notes }) => {
    return (_jsxs(Popover, { trigger: "hover", placement: "right", children: [_jsx(PopoverTrigger, { children: _jsx(Text, { color: "white", cursor: "pointer", _hover: {
                        color: "#F2B705",
                    }, children: subject }) }), _jsxs(PopoverContent, { bg: "#08162b", borderColor: "#22345F", color: "white", width: "320px", children: [_jsx(PopoverArrow, { bg: "#08162b" }), _jsx(PopoverBody, { children: _jsxs(Text, { children: [_jsx("strong", { children: "Notes:" }), " ", notes] }) })] })] }));
};
export default LeaveNotesPopover;
