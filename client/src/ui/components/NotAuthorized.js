import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WarningIcon } from "@chakra-ui/icons";
import { Button, Icon as ChakraIcon, HStack, Icon, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, } from "@chakra-ui/react";
import { useState } from "react";
const NotAuthorized = ({ buttonText, icon, placement, width, color, }) => {
    const [buttonClicked, setButtonClicked] = useState(false);
    return (_jsxs(Popover, { placement: placement, trigger: "click", children: [_jsx(PopoverTrigger, { children: _jsx(Button, { color: "#ffffff", bg: buttonClicked ? "red" : color, w: width, mt: 4, leftIcon: _jsx(ChakraIcon, { as: icon, color: "#ffffff", boxSize: "1.3rem", mr: "0.5rem" }), onClick: () => setButtonClicked((prev) => !prev), fontSize: "1.1rem", children: _jsx(Text, { position: "relative", right: "0.3rem", top: "0.5rem", children: buttonText }) }) }), _jsxs(PopoverContent, { height: "4.5rem", width: "17rem", bg: "red.50", border: "1px solid", borderColor: "red.200", borderLeftWidth: "5px", borderLeftColor: "red.500", boxShadow: "lg", children: [_jsx(PopoverArrow, { bg: "red.50" }), _jsx(PopoverBody, { py: 3, children: _jsxs(HStack, { align: "start", spacing: 3, children: [_jsx(Icon, { as: WarningIcon, color: "red.500", boxSize: 5, mt: "2px" }), _jsx("span", { children: "Vous n'\u00EAtes pas autoris\u00E9 \u00E0 effectuer cette op\u00E9ration." })] }) })] })] }));
};
export default NotAuthorized;
