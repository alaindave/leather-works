import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Grid, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";
import LeaveNotesPopover from "../LeaveNotesPopover";
const EmployeeLeaveCard = ({ leave, onDelete, gridTemplate }) => {
    const [localLeave, setLocalLeave] = useState(leave);
    const { _id, employee: { employeeID, firstName, lastName, remainingLeave }, startDate, endDate, subject, notes, status, } = localLeave;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    //Handle leave approval
    const handleApprove = () => {
        const _startDate = new Date(startDate);
        const _endDate = new Date(endDate);
        console.log("startDate :", _startDate);
        console.log("endDate :", _endDate);
        const leaveDays = Math.ceil((_endDate.getTime() - _startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        console.log("Leave days :", leaveDays);
        let updatedRemainingLeave = remainingLeave - leaveDays;
        if (updatedRemainingLeave <= 0) {
            updatedRemainingLeave = 0;
        }
        console.log("Employee ID to leave:", leave.employee._id);
        console.log("updatedRemainingLeave:", updatedRemainingLeave);
        axios
            .put(`${API_URL}/employees/${leave.employee._id}`, {
            remainingLeave: updatedRemainingLeave,
        })
            .then((res) => {
            console.log("Updated employee: ", res.data);
            return axios.put(`${API_URL}/leaves/${_id}`, {
                status: "Approuvé",
            });
        })
            .then((res) => {
            console.log("Updated leave: ", res.data);
            setLocalLeave(res.data);
        })
            .catch((error) => console.error("An error occured while approving the leave", error));
    };
    //Handle leave denial
    const handleDeny = () => {
        axios
            .put(`${API_URL}/leaves/${_id}`, { status: "Refusé" })
            .then((res) => {
            console.log("Denied leave: ", res.data);
            setLocalLeave(res.data);
        })
            .catch((error) => console.error("An error occured while denying the leave", error));
    };
    return (_jsxs(Grid, { templateColumns: gridTemplate, alignItems: "center", px: 4, py: 4, bg: "#0E1E47", borderRadius: "18px", border: "1px solid #22345F", height: "78px", width: "80vw", marginBottom: "0.8px", children: [_jsx(Box, { ml: "11px", mb: 14, children: _jsxs(Text, { color: "gray.200", fontSize: "1.1rem", children: [firstName, " ", lastName] }) }), _jsx(Box, { ml: "12px", mb: 14, children: _jsx(Text, { color: "gray.200", fontSize: "1.1rem", children: new Date(startDate).toLocaleDateString("fr-FR") }) }), _jsx(Box, { ml: "8px", mb: 14, children: _jsx(Text, { color: "gray.200", fontSize: "1.1rem", children: new Date(endDate).toLocaleDateString("fr-FR") }) }), _jsx(Box, { mb: 14, position: "relative", left: "10px", children: _jsx(Text, { color: "gray.200", fontSize: "1.1rem", children: _jsx(LeaveNotesPopover, { subject: subject, notes: notes }) }) }), _jsx(Box, { mb: 14, children: _jsx(Text, { color: status === "Approuvé"
                        ? "#68D391"
                        : status === "Refusé"
                            ? "#FC8181"
                            : "#F6E05E", fontWeight: "600", fontSize: "1.05rem", children: status }) }), _jsx(Box, { mb: 12, children: _jsx(Text, { color: "gray.200", fontSize: "1.1rem", position: "relative", bottom: "8px", children: remainingLeave }) }), _jsx(Box, { mb: 6, position: "relative", left: "40px", children: _jsx(Text, { color: "gray.200", fontSize: "1.1rem", children: _jsxs(Menu, { placement: "bottom-end", children: [_jsx(MenuButton, { mb: 10, as: IconButton, icon: _jsx(PiDotsThreeOutlineVerticalDuotone, { size: "18px" }), variant: "ghost", size: "sm", borderRadius: "full", color: "yellow.300", _hover: {
                                    bg: "#1D326B",
                                    color: "white",
                                }, _expanded: {
                                    bg: "#1D326B",
                                }, "aria-label": "Actions" }), _jsxs(MenuList, { bg: "#132250", border: "1px solid #2A3D70", borderRadius: "14px", minW: "170px", p: "6px", boxShadow: "0 8px 30px rgba(0,0,0,0.35)", children: [status === "En attente d'approbation" && (_jsxs(_Fragment, { children: [_jsx(MenuItem, { icon: _jsx(IoIosCheckmarkCircleOutline, { color: "green.300", size: "20px" }), bg: "transparent", borderTop: "1px solid #2A3D70", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, onClick: handleApprove, children: "Approuver" }), _jsx(MenuItem, { icon: _jsx(TiDeleteOutline, { color: "orange.300", size: "20px" }), bg: "transparent", borderTop: "1px solid #2A3D70", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, onClick: handleDeny, children: "Refuser" })] })), _jsx(MenuItem, { height: "30px", mt: 2, pt: 3, borderTop: "0.3px solid #2A3D70", icon: _jsx(MdOutlineDeleteForever, { color: "red.300", size: "20px" }), bg: "transparent", color: "red.300", borderRadius: "10px", _hover: {
                                            bg: "rgba(255,0,0,0.08)",
                                        }, onClick: () => onDelete(), children: "Supprimer" })] })] }) }) })] }));
};
export default EmployeeLeaveCard;
