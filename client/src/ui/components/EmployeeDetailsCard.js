import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text, Box, HStack } from "@chakra-ui/react";
const EmployeeDetailsCard = ({ property, value, icon: Icon }) => {
    return (_jsxs(HStack, { marginBottom: "5px", borderRadius: "6px", bg: "#0E1E47", width: "47vw", height: "90px", borderWidth: "0.5px", borderColor: "gray.600", children: [_jsx(Box, { borderWidth: "0.5px", borderRadius: "20px", padding: "8px", marginBottom: "8px", children: _jsx(Icon, { color: "#F2B705", size: "1.2rem" }) }), _jsxs(HStack, { marginLeft: "4px", children: [_jsxs(Text, { color: "#C7D2FE", fontWeight: "700", fontSize: "1.3rem", children: [property, ":"] }), _jsxs(Text, { color: "gray.300", fontSize: "1.2rem", children: [value, " ", "", property === "Salaire" ? "FBU" : ""] })] })] }));
};
export default EmployeeDetailsCard;
