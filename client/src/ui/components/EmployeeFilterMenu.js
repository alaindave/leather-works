import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, } from "@chakra-ui/react";
import { useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { GiOfficeChair } from "react-icons/gi";
import { GiFactory } from "react-icons/gi";
import { MdOutlineHandyman } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa6";
import { GiGuards } from "react-icons/gi";
const EmployeeFilterMenu = ({ onFilterClicked }) => {
    const [filter, setFilter] = useState("");
    return (_jsxs(Menu, { children: [_jsx(MenuButton, { bg: "#08162b", width: "300px", as: Button, rightIcon: _jsx(FaChevronCircleDown, { color: "#ffffff" }), borderWidth: "0.5px", borderRadius: "15px", borderColor: "gray.600", _hover: { bg: "transparent" }, children: _jsx(Text, { color: "gray.400", position: "relative", top: "8px", children: filter || "Trier par département" }) }), _jsxs(MenuList, { backgroundColor: "#07182F", borderColor: "rgba(255,196,0,0.18)", borderRadius: "18px", position: "relative", left: "310px", bottom: "170px", maxH: "165px", overflowY: "auto", _hover: { color: "yellow" }, children: [_jsxs(MenuItem, { color: "#DBE7FF", backgroundColor: "#07182F", _hover: {
                            color: "#FFC400",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("");
                            setFilter("Tous les employés");
                        }, children: [_jsx(Box, { children: _jsx(BsPeopleFill, { size: "20px" }) }), _jsxs(Text, { marginTop: "15px", marginLeft: "10px", children: [" ", "Tous les employ\u00E9s"] })] }), _jsxs(MenuItem, { color: "#DBE7FF", backgroundColor: "#07182F", _hover: {
                            color: "#FFC400",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Administration");
                            setFilter("Administration");
                        }, children: [_jsx(Box, { children: _jsx(GiOfficeChair, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Administration" })] }), _jsxs(MenuItem, { color: "#DBE7FF", backgroundColor: "#07182F", _hover: {
                            color: "#FFC400",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Usine");
                            setFilter("Usine");
                        }, children: [_jsx(Box, { children: _jsx(GiFactory, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Usine" })] }), _jsxs(MenuItem, { color: "#DBE7FF", backgroundColor: "#07182F", _hover: {
                            color: "#FFC400",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Atelier");
                            setFilter("Atelier");
                        }, children: [_jsx(Box, { children: _jsx(MdOutlineHandyman, {}) }), _jsxs(Text, { marginTop: "15px", marginLeft: "10px", children: [" ", "Atelier"] })] }), _jsxs(MenuItem, { color: "#DBE7FF", backgroundColor: "#07182F", _hover: {
                            color: "#FFC400",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Magasin");
                            setFilter("Magasin");
                        }, children: [_jsx(Box, { children: _jsx(FaWarehouse, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Magasin" })] }), _jsxs(MenuItem, { color: "#DBE7FF", backgroundColor: "#07182F", _hover: {
                            color: "#FFC400",
                            backgroundColor: "rgba(255,196,0,0.14)",
                        }, onClick: () => {
                            onFilterClicked("Sentinelle");
                            setFilter("Sentinelle");
                        }, children: [_jsx(Box, { children: _jsx(GiGuards, {}) }), _jsx(Text, { marginTop: "15px", marginLeft: "10px", children: "Sentinelle" })] })] })] }));
};
export default EmployeeFilterMenu;
