import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSlidersH } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { GiOfficeChair } from "react-icons/gi";
import { GiFactory } from "react-icons/gi";
import { MdOutlineHandyman } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa6";
import { GiGuards } from "react-icons/gi";
const EmployeeFilterMenu = ({ onFilterClicked }) => {
    const [filter, setFilter] = useState("");
    return (_jsxs(Menu, { children: [_jsx(MenuButton, { bg: "#FFFFFF", width: "300px", as: Button, leftIcon: _jsx(FaSlidersH, { color: "black" }), rightIcon: _jsx(IoIosArrowDown, { color: "black" }), border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(15,23,42,.06)", _hover: { bg: "transparent" }, children: _jsx(Text, { color: "gray.800", position: "relative", top: "8px", children: filter || "Trier par département" }) }), _jsxs(MenuList, { backgroundColor: "#ffffff", borderColor: "rgba(255,196,0,0.18)", borderRadius: "18px", maxH: "160px", ml: "3rem", position: "relative", left: "17rem", bottom: "9.5rem", overflowY: "auto", _hover: { color: "yellow" }, children: [_jsxs(MenuItem, { color: "gray.800", fontSize: "1.1rem", backgroundColor: "#ffffff", _hover: {
                            color: "#4F46E5",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("");
                            setFilter("Tous les employés");
                        }, children: [_jsx(Box, { children: _jsx(BsPeopleFill, { size: "20px" }) }), _jsxs(Text, { marginTop: "15px", marginLeft: "10px", children: [" ", "Tous les employ\u00E9s"] })] }), _jsxs(MenuItem, { color: "gray.800", fontSize: "1.1rem", backgroundColor: "#ffffff", _hover: {
                            color: "#4F46E5",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Administration");
                            setFilter("Administration");
                        }, children: [_jsx(Box, { children: _jsx(GiOfficeChair, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Administration" })] }), _jsxs(MenuItem, { color: "gray.800", fontSize: "1.1rem", backgroundColor: "#ffffff", _hover: {
                            color: "#4F46E5",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Usine");
                            setFilter("Usine");
                        }, children: [_jsx(Box, { children: _jsx(GiFactory, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Usine" })] }), _jsxs(MenuItem, { color: "gray.800", fontSize: "1.1rem", backgroundColor: "#ffffff", _hover: {
                            color: "#4F46E5",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Atelier");
                            setFilter("Atelier");
                        }, children: [_jsx(Box, { children: _jsx(MdOutlineHandyman, {}) }), _jsxs(Text, { marginTop: "15px", marginLeft: "10px", children: [" ", "Atelier"] })] }), _jsxs(MenuItem, { color: "gray.800", fontSize: "1.1rem", backgroundColor: "#ffffff", _hover: {
                            color: "#4F46E5",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Magasin");
                            setFilter("Magasin");
                        }, children: [_jsx(Box, { children: _jsx(FaWarehouse, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Magasin" })] }), _jsxs(MenuItem, { color: "gray.800", fontSize: "1.1rem", backgroundColor: "#ffffff", _hover: {
                            color: "#4F46E5",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Sentinelle");
                            setFilter("Sentinelle");
                        }, children: [_jsx(Box, { children: _jsx(GiGuards, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Sentinelle" })] })] })] }));
};
export default EmployeeFilterMenu;
