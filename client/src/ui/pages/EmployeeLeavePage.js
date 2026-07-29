import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Flex, Grid, HStack, Spacer, Text, VStack, useDisclosure, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import EmployeeLeaveCard from "../components/EmployeeLeaveCard";
import MonthDropDown from "../components/MonthDropDown";
import LeaveSubmissionModal from "../components/LeaveSubmissionModal";
import DeletionDialog from "../components/DeletionDialog";
import { FaSyncAlt } from "react-icons/fa";
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;
const Shimmer = ({ width = "100%", height = "18px" }) => (_jsx(Box, { borderRadius: "6px", height: height, width: width, bg: "gray.300", backgroundSize: "400% 100%", animation: "shimmer 1.4s ease infinite" }));
const gridTemplate = `
1.8fr 1.6fr 1.6fr 1.5fr 1.5fr 1fr 1fr
`;
const EmployeeLeavePage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose, } = useDisclosure();
    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [submissionMonth, setSubmissionMonth] = useState(new Date().toISOString().slice(0, 7));
    useEffect(() => {
        window.electron.employees
            .getAll()
            .then((employees) => {
            setEmployees(employees);
            console.log("Fetched employees:", employees);
        })
            .catch((error) => {
            console.error("Error while fetching employees: ", error);
        })
            .finally(() => {
            setLoading(false);
        });
    }, []);
    useEffect(() => {
        console.log("Selected month: ", submissionMonth);
        window.electron.leave
            .getLeaveByMonth(submissionMonth)
            .then((leaves) => {
            setLeaves(leaves);
            console.log(`Fetched leaves for the month of ${submissionMonth}:${leaves}`);
        })
            .catch((error) => {
            console.error("Error while fetching leaves: ", error);
        })
            .finally(() => {
            setLoading(false);
            setRefresh(false);
        });
    }, [submissionMonth, refresh]);
    //Leave sync and refresh
    const handleLeaveSync = async () => {
        try {
            setLoading(true);
            const result = await window.electron.sync();
            if (result.success) {
                console.log("Sync completed");
                const leaves = await window.electron.leave.getLeaveByMonth(submissionMonth);
                setLeaves(leaves);
                console.log(`Fetched leaves for the month of ${submissionMonth}:${leaves}`);
            }
            else {
                console.error(result.message);
            }
        }
        finally {
            setLoading(false);
        }
    };
    //Submit leave delete request
    const handleLeaveDelete = async () => {
        console.log("Leave to delete: ", leave);
        console.log("Leave ID to delete: ", leave?._id);
        if (!leave?._id)
            return;
        await window.electron.leave
            .delete(leave?._id)
            .then((leave) => {
            console.log("Deleted leave: ", leave);
            const updatedLeaves = leaves.filter((l) => l._id !== leave?._id);
            setLeaves(updatedLeaves);
            setRefresh(true);
            setSubmissionMonth(submissionMonth);
            onConfirmationClose();
        })
            .catch((error) => console.error("An error occured while deleting attendance: ", error));
    };
    //Handle delete button confirmation dialog
    const handleDeleteConfirmation = (leave) => {
        onConfirmationOpen();
        setLeave(leave);
    };
    // /* ================= LOADING UI ================= */
    if (loading)
        return (_jsxs(_Fragment, { children: [_jsx(Box, { as: "style", children: shimmerKeyframes }), _jsxs(VStack, { children: [_jsxs(Box, { position: "relative", top: "0.5rem", ml: "3px", bg: "gray.300", height: "200px", width: "80vw", borderRadius: "20px", p: 4, children: [_jsx(Shimmer, { width: "200px", height: "28px" }), _jsx(Box, { mt: 2, children: _jsx(Shimmer, { width: "320px", height: "16px" }) }), _jsx(Box, { position: "absolute", right: "8px", top: "8px", children: _jsx(Shimmer, { width: "220px", height: "40px" }) })] }), _jsx(Grid, { templateColumns: gridTemplate, bg: "gray.300", mt: "0.5rem", ml: "0.3rem", mr: "0.3rem", height: "66px", width: "80vw", borderRadius: "12px", px: 6, alignItems: "center", children: [...Array(7)].map((_, i) => (_jsx(Shimmer, { width: "90%", height: "18px" }, i))) }), _jsx(Box, { height: "90vh", width: "80vw", overflow: "hidden", children: [...Array(6)].map((_, i) => (_jsxs(Grid, { templateColumns: gridTemplate, bg: "gray.300", borderBottom: "1px solid #1E355A", alignItems: "center", px: 6, py: 4, children: [_jsx(Shimmer, { width: "140px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "90px" }), _jsx(Shimmer, { width: "80px" }), _jsxs(HStack, { children: [_jsx(Shimmer, { width: "30px", height: "30px" }), _jsx(Shimmer, { width: "30px", height: "30px" })] })] }, i))) }), _jsx(Box, { bg: "gray.300", height: "80px", width: "80vw", mb: "1rem" })] })] }));
    return (_jsxs(_Fragment, { children: [_jsxs(Flex, { direction: "column", bg: "#F8FAFC", justify: "space-between", width: "100vw", children: [_jsxs(Flex, { ml: "0.05rem", height: "10rem", width: "80vw", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Text, { color: "#1F2937", fontSize: "clamp(1.3rem, 1vw + 0.8rem, 1.4rem)", fontWeight: "700", ml: "0.5rem", mt: "0.7rem", children: "Cong\u00E9s" }), _jsx(Button, { bg: "transparent", isLoading: loading, color: "gray.800", _hover: { bg: "transparent" }, fontSize: "1rem", position: "relative", bottom: "0.2rem", right: "1rem", onClick: handleLeaveSync, children: _jsx(FaSyncAlt, {}) })] }), _jsx(Text, { fontWeight: "500", left: "0.45rem", fontSize: "clamp(1rem, 1vw + 0.8rem, 1.1rem)", color: "gray.500", position: "relative", bottom: "1.4rem", children: "G\u00E9rez les demandes de cong\u00E9s" })] }), _jsx(Spacer, {}), _jsxs(Button, { bg: "#4F46E5", color: "#ffffff", size: "md", onClick: onOpen, zIndex: "1", mt: "1rem", mr: "1rem", _hover: { backgroundColor: "#4F46E5" }, children: [_jsxs(Box, { mr: "0.5rem", children: [" ", _jsx(FaCirclePlus, { size: "1.2rem" })] }), _jsx(Text, { bg: "#4F46E5", fontSize: "1.1rem", color: "#ffffff", mt: "0.8rem", children: "Soumettre une demande" })] })] }), leaves.length === 0 ? (_jsx(Box, { children: _jsx(Text, { fontSize: "2rem", fontStyle: "revert", fontWeight: "600", color: "gray.600", position: "relative", left: "20rem", children: "Aucune demande de cong\u00E9 retrouv\u00E9e" }) })) : (_jsxs(_Fragment, { children: [_jsxs(Grid, { templateColumns: gridTemplate, fontWeight: "600", bg: "#F8F9FB", borderWidth: "0.3px", border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(15,23,42,.06)", height: "4.7rem", width: "80vw", overflowY: "hidden", overflowX: "hidden", mt: "0.3rem", ml: "0.4rem", children: [_jsx(Text, { color: "gray.800", fontSize: "1.1rem", ml: 8, mt: 4, children: "Employ\u00E9" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: 4, children: "Debut de cong\u00E9" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: 4, children: "Fin de cong\u00E9" }), _jsx(Text, { mt: 4, ml: 2, color: "gray.800", fontSize: "1.1rem", children: "Motif" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: 4, children: "Statut" }), _jsxs(Box, { mt: "0.4rem", position: "relative", right: "1rem", children: [_jsx(Text, { color: "gray.800", fontSize: "1.1rem", children: "Cong\u00E9s" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", position: "relative", bottom: "1.4rem", children: "restants" })] }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: 4, children: "Actions" })] }), _jsx(Box, { height: "90vh", overflowX: "hidden", overflowY: "auto", children: leaves.map((leave, index) => {
                                    console.log("Leave at index", index, leave);
                                    return (_jsx(EmployeeLeaveCard, { leave: leave, gridTemplate: gridTemplate, onDelete: () => handleDeleteConfirmation(leave) }, leave?._id ?? index));
                                }) })] })), _jsxs(Flex, { bg: "#F8F9FB", borderWidth: "0.3px", border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(15,23,42,.06)", mb: "2.7rem", ml: "0.01rem", height: "4.5rem", width: "82vw", justify: "space-between", children: [_jsx(Box, { mt: "0.47rem", ml: "1rem", fontSize: "1.2rem", fontFamily: "monospace", fontWeight: "600", children: _jsx(MonthDropDown, { onChange: (month) => setSubmissionMonth(month) }) }), _jsx(Box, { color: "gray.800", fontSize: "24px", fontWeight: "600", mt: "0.5rem", mr: "2rem", children: _jsx(Text, { children: new Date().toLocaleDateString("fr-FR") }) })] })] }), _jsx(LeaveSubmissionModal, { isOpen: isOpen, onClose: onClose, onRefresh: () => setRefresh(true), employees: employees }), _jsx(DeletionDialog, { isOpen: isConfirmationOpen, onClose: onConfirmationClose, onConfirmation: handleLeaveDelete, header: "Supprimer", body: "Etes vous sur de vouloir supprimer cette demande?" })] }));
};
export default EmployeeLeavePage;
