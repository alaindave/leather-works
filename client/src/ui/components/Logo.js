import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import "../styles/App.css";
const Logo = ({ text }) => {
    return (_jsxs(Flex, { children: [_jsx(Box, { children: _jsx(Link, { to: "/admin", children: _jsx(Image, { src: logo, boxSize: "70px", borderRadius: "30px" }) }) }), _jsxs(Box, { marginLeft: "8px", children: [_jsx(Text, { color: "#F2B705", fontSize: "25px", fontWeight: "700", children: "AFRITAN" }), _jsx(Text, { position: "relative", bottom: "25px", fontSize: "16px", fontWeight: "500", color: "#ffffff", children: text })] })] }));
};
export default Logo;
