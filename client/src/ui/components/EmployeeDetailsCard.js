import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, Icon as ChakraIcon, Text } from "@chakra-ui/react";
const EmployeeDetailsCard = ({ property, value, icon }) => {
    return (_jsxs(Flex, { align: "center", gap: 4, mb: 3, p: 4, w: "100%", minH: "4rem", maxH: "6rem", bg: "#F8F9FB", borderRadius: "12px", borderWidth: "2px", borderColor: "gray.200", children: [_jsx(Box, { p: 3, borderWidth: "2px", borderRadius: "full", borderColor: "purple.400", bg: "rgba(242,183,5,0.08)", flexShrink: 0, height: "2.2rem", width: "2.2rem", position: "relative", children: _jsx(ChakraIcon, { as: icon, color: "purple.600", fontSize: "1.3rem", position: "relative", bottom: "0.6rem", right: "0.4rem" }) }), _jsxs(Box, { flex: "1", minW: 0, ml: "0.3rem", mt: "1.5rem", children: [_jsx(Text, { color: "gray.700", fontWeight: "700", fontSize: { base: "md", md: "lg", lg: "lg" }, children: property }), _jsxs(Text, { color: "gray.600", fontSize: { base: "md", md: "lg" }, wordBreak: "break-word", position: "relative", bottom: "0.8rem", children: [value || "N.D.", property === "Salaire" ? " FBU" : ""] })] })] }));
};
export default EmployeeDetailsCard;
