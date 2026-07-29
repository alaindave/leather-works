import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Image, Box, Grid, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAdminUser from "../../store/auth.store";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import LeaveNotesPopover from "./LeaveNotesPopover";
import LeaveEdit from "./LeaveEdit";
import defaultAvatar from "../assets/default-avatar.jpeg";
const EmployeeLeaveCard = ({ leave, onDelete, gridTemplate }) => {
    const [localLeave, setLocalLeave] = useState(leave);
    const [employee, setEmployee] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [photo_url, setPhotoUrl] = useState("");
    const { _id, firstName, lastName, employeeId, remainingLeave, startDate, endDate, subject, notes, status, } = localLeave;
    const adminUser = useAdminUser((store) => store.adminUser);
    //Fetch employee
    useEffect(() => {
        async function fetchEmployee() {
            try {
                const employee = await window.electron.employees.getById(leave.employeeId);
                setEmployee(employee);
            }
            catch (e) {
                console.error("AN ERROR OCCURED WHILE FETCHING THE EMPLOYEE.", e);
            }
        }
        fetchEmployee();
    }, []);
    //Fetch employee photos URL
    useEffect(() => {
        async function load() {
            if (!employee.photo_path)
                return;
            const base64 = await window.electron.employees.getPhotoUrl(employee.photo_path);
            setPhotoUrl(`data:image/jpeg;base64,${base64}`);
        }
        load();
    }, [employee.photo_path]);
    // //Handle leave approval
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
        console.log("Employee ID to leave:", employeeId);
        console.log("updatedRemainingLeave:", updatedRemainingLeave);
        window.electron.employees
            .update(employeeId, { remainingLeave: updatedRemainingLeave })
            .then((employee) => {
            console.log("Updated employee: ", employee);
            console.log("ID of leave to update:", leave._id);
            return window.electron.leave.update(leave._id, {
                status: "APPROUVÉ",
            });
        })
            .then((leave) => {
            console.log("Updated leave: ", leave);
            setLocalLeave(leave);
        })
            .catch((error) => console.error("An error occured while approving the leave", error));
    };
    //Handle leave denial
    const handleDeny = () => {
        window.electron.leave
            .update(leave._id, {
            status: "REFUSÉ",
        })
            .then((leave) => {
            console.log("Denied leave: ", leave);
            setLocalLeave(leave);
        })
            .catch((error) => console.error("An error occured while denying the leave", error));
    };
    // // Handle cancel
    const handleCancel = () => {
        window.electron.leave
            .update(leave._id, {
            status: "ANNULÉ",
        })
            .then((leave) => {
            console.log("Cancelled leave: ", leave);
            setLocalLeave(leave);
        })
            .catch((error) => console.error("An error occured while cancelling the leave", error));
    };
    //Leave refresh
    const refreshLeave = async () => {
        const freshLeave = await window.electron.leave.getLeaveById(_id);
        setLocalLeave(freshLeave);
    };
    return (_jsxs(Grid, { templateColumns: gridTemplate, alignItems: "center", ml: "0.5rem", px: 3, py: 3, bg: "#ffffff", border: "1px solid #E2E8F0", borderWidth: "0.3px", boxShadow: "0 2px 10px rgba(15,23,42,.06)", minH: "6.3rem", width: "80vw", marginBottom: "0.8px", children: [_jsx(Box, { children: _jsxs(HStack, { children: [_jsx(Image, { src: photo_url || defaultAvatar, boxSize: "70px", borderRadius: "full", fit: "cover" }), _jsxs(Text, { color: "gray.800", mt: "0.6rem", fontWeight: "500", fontSize: "1.1rem", whiteSpace: "normal", wordBreak: "break-word", maxW: "7rem", noOfLines: 2, children: [firstName, " ", lastName] })] }) }), _jsx(Box, { children: _jsx(Text, { color: "gray.600", fontWeight: "500", fontSize: "1.1rem", children: new Date(startDate).toLocaleDateString("fr-FR") }) }), _jsx(Box, { children: _jsx(Text, { color: "gray.600", fontWeight: "500", fontSize: "1.1rem", children: new Date(endDate).toLocaleDateString("fr-FR") }) }), _jsx(Box, { children: _jsx(LeaveNotesPopover, { subject: subject, notes: notes }) }), _jsx(Box, { width: "7rem", children: status === "EN ATTENTE D'APPROBATION" ? (_jsxs(Text, { color: "yellow.600", fontWeight: "600", fontSize: "1.05rem", whiteSpace: "normal", wordBreak: "break-word", children: ["En attente", "\n", "d'approbation"] })) : (_jsx(Text, { color: status === "APPROUVÉ"
                        ? "green.700"
                        : status === "REFUSÉ"
                            ? "#FC8181"
                            : "yellow.500", fontWeight: "600", fontSize: "1.05rem", whiteSpace: "normal", wordBreak: "break-word", children: status })) }), _jsx(Box, { position: "relative", left: "1rem", children: _jsx(Text, { color: "gray.800", fontSize: "1.1rem", children: remainingLeave }) }), adminUser?.role === "manager" ? (
            // Manager area
            _jsx(Box, { children: _jsx(Text, { color: "gray.200", fontSize: "1.1rem", children: _jsxs(Menu, { placement: "bottom-end", children: [_jsx(MenuButton, { mb: 10, as: IconButton, icon: _jsx(PiDotsThreeOutlineVerticalDuotone, { size: "1.5rem" }), variant: "ghost", size: "1rem", borderRadius: "full", fontWeight: "600", color: "red.600", _hover: {
                                    bg: "#1D326B",
                                    color: "white",
                                }, _expanded: {
                                    bg: "#1D326B",
                                }, "aria-label": "Actions", position: "relative", top: "1rem", left: "2rem" }), _jsx(MenuList, { bg: "#132250", border: "1px solid #2A3D70", borderRadius: "14px", minW: "170px", p: "6px", boxShadow: "0 8px 30px rgba(0,0,0,0.35)", children: status === "EN ATTENTE D'APPROBATION" ? (_jsxs(_Fragment, { children: [_jsx(MenuItem, { fontWeight: "600", mb: 2, icon: _jsx(IoIosCheckmarkCircleOutline, { color: "green.300", size: "20px" }), borderBottom: "1px solid #2A3D70", bg: "transparent", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, onClick: handleApprove, children: "Approuver" }), _jsx(MenuItem, { fontWeight: "600", icon: _jsx(TiDeleteOutline, { color: "orange.300", size: "20px" }), bg: "transparent", borderBottom: "1px solid #2A3D70", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, onClick: handleDeny, mb: 2, children: "Refuser" }), _jsxs(MenuItem, { icon: _jsx(FaRegEdit, { color: "orange.300", size: "20px" }), bg: "transparent", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, onClick: onOpen, children: [_jsx(Text, { fontWeight: "600", position: "relative", top: "8px", children: "Modifier" }), _jsx(LeaveEdit, { leave: leave, isOpen: isOpen, onClose: onClose, onUpdated: refreshLeave })] })] })) : (_jsx(MenuItem, { height: "20px", mb: 2, pt: 3, icon: _jsx(MdOutlineDeleteForever, { color: "red.300", size: "20px" }), bg: "transparent", color: "red.300", borderRadius: "10px", _hover: {
                                        bg: "rgba(255,0,0,0.08)",
                                    }, onClick: () => onDelete(), children: "Supprimer" })) })] }) }) })) : (
            // Admin area
            _jsx(Box, { children: _jsx(Text, { color: "gray.200", fontSize: "1.1rem", children: _jsxs(Menu, { placement: "bottom-end", children: [_jsx(MenuButton, { mb: 10, as: IconButton, icon: _jsx(PiDotsThreeOutlineVerticalDuotone, { size: "1.6rem" }), color: "brown", variant: "ghost", borderRadius: "full", _hover: {
                                    bg: "#1D326B",
                                    color: "white",
                                }, _expanded: {
                                    bg: "#1D326B",
                                }, "aria-label": "Actions", position: "relative", top: "1rem" }), _jsx(MenuList, { bg: "#132250", border: "1px solid #2A3D70", borderRadius: "14px", minW: "170px", p: "6px", boxShadow: "0 8px 30px rgba(0,0,0,0.35)", children: status === "EN ATTENTE D'APPROBATION" ? (_jsxs(_Fragment, { children: [_jsx(MenuItem, { icon: _jsx(FaRegEdit, { color: "orange.300", size: "1rem" }), bg: "transparent", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, onClick: onOpen, fontSize: "1.1rem", children: "Modifier la demande" }), _jsx(LeaveEdit, { leave: leave, onUpdated: refreshLeave, isOpen: isOpen, onClose: onClose }), _jsx(MenuItem, { bg: "transparent", borderTop: "1px solid #2A3D70", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, onClick: () => onDelete(), icon: _jsx(MdOutlineDeleteForever, { color: "red.300", size: "1.2rem" }), children: _jsx(Text, { fontWeight: "600", fontSize: "1.1rem", children: "Annuler" }) })] })) : (_jsx(MenuItem, { bg: "transparent", color: "white", borderRadius: "10px", _hover: { bg: "#1D326B" }, fontSize: "1rem", fontWeight: "600", onClick: handleCancel, children: "Annuler" })) })] }) }) }))] }));
};
export default EmployeeLeaveCard;
