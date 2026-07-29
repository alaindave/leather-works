import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import "../styles/App.css";
const Logo = ({ text }) => {
    return (_jsxs(Flex, { children: [_jsx(Box, { children: _jsx(Link, { to: "/admin", children: _jsx(Image, { src: logo, width: "5rem", height: "5rem" }) }) }), _jsxs(Box, { position: "relative", left: "0.4rem", top: "0.3rem", children: [_jsx(Text, { color: "#1F2937", fontSize: "25px", fontWeight: "700", children: "AFRITAN" }), _jsx(Text, { position: "relative", left: "0.1rem", bottom: "1.5rem", fontSize: "0.96rem", color: "gray.600", fontWeight: "300", whiteSpace: "nowrap", children: text })] })] }));
};
export default Logo;
