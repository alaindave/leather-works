import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, FormControl, FormLabel, Grid, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, VStack, useDisclosure, } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { z } from "zod";
import EmployeeLeaveCard from "../components/ui/EmployeeLeaveCard";
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;
const Shimmer = ({ width = "100%", height = "18px" }) => (_jsx(Box, { borderRadius: "6px", height: height, width: width, background: "linear-gradient(90deg, #0A1F57 25%, #132C68 37%, #0A1F57 63%)", backgroundSize: "400% 100%", animation: "shimmer 1.4s ease infinite" }));
const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
    startDate: z.date({ message: errorMessage }),
    endDate: z.date({ message: errorMessage }),
    subject: z.string().min(1, { message: errorMessage }),
    notes: z.string().min(1, { message: errorMessage }),
});
const gridTemplate = `
1.7fr 1.5fr 1.5fr 1.5fr 1.5fr 100px 100px
`;
const EmployeeLeavePage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose, } = useDisclosure();
    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [leave, setLeave] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [startDateType, setStartDateType] = useState("text");
    const [endDateType, setEndDateType] = useState("text");
    const cancelRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    //Handle leave submission
    const onSubmit = async (data) => {
        if (!employee?._id) {
            console.error("No employee selected");
            return;
        }
        const leaveData = {
            startDate: data.startDate,
            endDate: data.endDate,
            subject: data.subject,
            notes: data.notes,
        };
        try {
            const response = await axios.post(`${API_URL}/leaves/${employee._id}`, leaveData);
            setLeaves((prevLeaves) => [response.data, ...prevLeaves]);
            onClose();
            reset();
            setEmployee(null);
            setErrorMessage("");
        }
        catch (error) {
            console.error("Unable to save leave:", error.message);
            console.error("Unable to save leave:error status", error.status);
            if (error.status == "400")
                setErrorMessage("Une demande de congé existe deja pour cet employé");
        }
    };
    const handleMenuClick = (employee) => {
        console.log("Employee selected: ", employee);
        setEmployee(employee);
    };
    const handleFormClose = () => {
        setEmployee(null);
        reset();
        onClose();
        setErrorMessage("");
    };
    //Submit leave delete request
    const handleLeaveDelete = async () => {
        console.log("Leave to delete: ", leave);
        console.log("Leave ID to delete: ", leave?._id);
        onConfirmationClose();
        await axios
            .delete(`${API_URL}/leaves/${leave?._id}`)
            .then((res) => {
            console.log("Deleted leave: ", res.data);
            const updatedLeaves = leaves.filter((l) => l._id !== leave?._id);
            setLeaves(updatedLeaves);
        })
            .catch((error) => console.error("An error occured while deleting attendance: ", error));
    };
    //Handle delete button confirmation dialog
    const handleDeleteConfirmation = (leave) => {
        onConfirmationOpen();
        setLeave(leave);
    };
    useEffect(() => {
        axios
            .get(`${API_URL}/leaves`)
            .then((res) => {
            setLeaves(res.data);
            return axios.get(`${API_URL}/employees`);
        })
            .then((res) => {
            setEmployees(res.data);
        })
            .catch((error) => {
            console.error("Error while fetching leaves: ", error);
        })
            .finally(() => {
            setLoading(false);
        });
    }, []);
    /* ================= LOADING UI ================= */
    if (loading)
        return (_jsxs(_Fragment, { children: [_jsx(Box, { as: "style", children: shimmerKeyframes }), _jsxs(VStack, { children: [_jsxs(Box, { position: "relative", top: "50px", ml: "3px", bg: "#03143B", height: "200px", width: "80vw", borderRadius: "20px", p: 4, children: [_jsx(Shimmer, { width: "200px", height: "28px" }), _jsx(Box, { mt: 2, children: _jsx(Shimmer, { width: "320px", height: "16px" }) }), _jsx(Box, { position: "absolute", right: "8px", top: "8px", children: _jsx(Shimmer, { width: "220px", height: "40px" }) })] }), _jsx(Grid, { templateColumns: gridTemplate, bg: "#08162b", mt: "44px", ml: "4px", mr: "4px", height: "66px", width: "80vw", borderRadius: "12px", px: 6, alignItems: "center", children: [...Array(7)].map((_, i) => (_jsx(Shimmer, { width: "90%", height: "18px" }, i))) }), _jsx(Box, { height: "90vh", width: "80vw", overflow: "hidden", children: [...Array(6)].map((_, i) => (_jsxs(Grid, { templateColumns: gridTemplate, bg: "#0A1F57", borderBottom: "1px solid #1E355A", alignItems: "center", px: 6, py: 4, children: [_jsx(Shimmer, { width: "140px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "90px" }), _jsx(Shimmer, { width: "80px" }), _jsxs(HStack, { children: [_jsx(Shimmer, { width: "30px", height: "30px" }), _jsx(Shimmer, { width: "30px", height: "30px" })] })] }, i))) }), _jsx(Box, { bg: "#08162b", height: "80px", width: "80vw", mb: "2px" })] })] }));
    return (_jsxs(_Fragment, { children: [_jsxs(VStack, { children: [_jsx(Box, { position: "relative", top: "50px", ml: "3px", bg: "#03143B", height: "200px", width: "80vw", borderRadius: "20px", children: _jsxs(HStack, { children: [_jsxs(Box, { children: [_jsx(Text, { color: "#ffffff", fontSize: "27px", fontWeight: "700", marginLeft: "15px", marginTop: "10px", children: "Cong\u00E9s" }), _jsx(Text, { color: "#ffffff", fontSize: "15px", fontWeight: "500", position: "relative", bottom: "20px", marginLeft: "15px", children: "G\u00E9rez les demandes de cong\u00E9s" })] }), _jsxs(Button, { borderColor: "black", backgroundColor: "#F2B705", borderRadius: "15px", borderWidth: "5px", color: "black", size: "md", onClick: onOpen, position: "absolute", right: "8px", top: "8px", zIndex: "1", children: [_jsx(FaCirclePlus, {}), " ", _jsx(Text, { position: "relative", top: "8px", fontSize: "18px", left: "8px", children: "Soumettre une demande" })] })] }) }), _jsx(_Fragment, { children: leaves.length === 0 ? (_jsx(Box, { children: _jsx(Text, { fontSize: "35px", fontStyle: "revert", fontWeight: "600", color: "gray.200", position: "relative", top: "300px", children: "Aucune demande de cong\u00E9 retrouv\u00E9" }) })) : (_jsxs(_Fragment, { children: [_jsxs(Grid, { templateColumns: gridTemplate, fontWeight: "600", background: "#08162b", mt: "44px", ml: "4px", mr: "4px", height: "66px", width: "80vw", borderRadius: "12px", children: [_jsx(Text, { fontSize: "18px", color: "#d6b65c", ml: 8, mt: 4, children: "Employ\u00E9" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", mt: 4, position: "relative", left: "10px", children: "Debut de cong\u00E9" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", mt: 4, position: "relative", left: "10px", children: "Fin de cong\u00E9" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", mt: 4, position: "relative", left: "5px", children: "Motif" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", mt: 4, position: "relative", right: "12px", children: "Statut" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", mt: 3.5, position: "relative", right: "35px", bottom: "5px", children: "Cong\u00E9s restants" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", mt: 4, children: "Actions" })] }), _jsx(Box, { height: "90vh", width: "80vw", overflowX: "hidden", overflowY: "hidden", position: "relative", bottom: "6px", children: leaves.map((leave) => (_jsx(EmployeeLeaveCard, { leave: leave, gridTemplate: gridTemplate, onDelete: () => handleDeleteConfirmation(leave) }, leave._id))) }), _jsx(Box, { background: "#08162b", height: "80px", width: "80vw", mb: "2px" })] })) })] }), _jsx(AlertDialog, { isOpen: isConfirmationOpen, leastDestructiveRef: cancelRef, onClose: onConfirmationClose, children: _jsx(AlertDialogOverlay, { backdropFilter: "auto", backdropBlur: "10px", children: _jsxs(AlertDialogContent, { bg: "#08162b", children: [_jsx(AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", color: "#ffffff", children: "Supprimer de la liste de cong\u00E9" }), _jsx(AlertDialogBody, { color: "#ffffff", children: "Etes de vous sur de vouloir supprimer l'employ\u00E9 de la liste de cong\u00E9?" }), _jsxs(AlertDialogFooter, { children: [_jsx(Button, { ref: cancelRef, onClick: onConfirmationClose, children: "Annuler" }), _jsx(Button, { colorScheme: "red", onClick: handleLeaveDelete, ml: 3, children: "Supprimer" })] })] }) }) }), _jsx(Box, { children: _jsxs(Modal, { size: "5xl", isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "30px" }), _jsx(ModalContent, { bg: "#08162b", position: "relative", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(ModalHeader, { color: "#ffffff", position: "relative", left: "120px", children: _jsxs(HStack, { children: [_jsx(Box, { position: "relative", left: "120px", children: _jsx("p", { style: {
                                                            color: "#ffffff",
                                                            fontSize: "21px",
                                                            fontWeight: "600",
                                                        }, children: "Demande de cong\u00E9" }) }), _jsx(Box, { position: "relative", left: "150px", children: _jsxs(Menu, { children: [_jsx(MenuButton, { backgroundColor: "transparent", as: Button, _hover: { bg: "transparent" }, children: employee?._id ? (_jsxs(HStack, { spacing: 2, children: [_jsxs(Text, { color: "#ffffff", fontSize: "22px", position: "relative", children: [employee?.firstName, " ", employee?.lastName] }), _jsxs(Text, { color: "#ffffff", fontSize: "18px", position: "relative", children: ["#", employee.employeeID] })] })) : (_jsx("p", { style: { color: "#ffffff", fontSize: "16px" }, children: "Choisissez un employ\u00E9" })) }), _jsx(MenuList, { maxH: "450px", overflowY: "auto", children: employees.map((employee) => (_jsx(MenuItem, { onClick: () => handleMenuClick(employee), color: "black", _hover: {
                                                                        backgroundColor: "#08162b",
                                                                        color: "#ffffff",
                                                                    }, children: _jsxs(Text, { children: [employee.firstName, " ", employee.lastName] }) }, employee._id))) })] }) })] }) }), _jsx(ModalCloseButton, { onClick: handleFormClose }), _jsx(ModalBody, { bg: "#08162b", children: _jsx(FormControl, { children: _jsxs(VStack, { spacing: "10px", children: [_jsxs(HStack, { children: [_jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Nom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: employee?.lastName || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Prenom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: employee?.firstName || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Poste", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: employee?.role || "", isReadOnly: true })] })] }), _jsxs(HStack, { children: [_jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Departement", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: employee?.department || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date de d\u00E9but de cong\u00E9", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Controller, { control: control, name: "startDate", render: ({ field }) => (_jsx(DatePicker, { selected: field.value, onChange: (date) => field.onChange(date), locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 100, customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), errors.startDate && (_jsx(Text, { className: "text-danger", children: errors.startDate.message }))] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date de fin de cong\u00E9", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Controller, { control: control, name: "endDate", render: ({ field }) => (_jsx(DatePicker, { selected: field.value, onChange: (date) => field.onChange(date), locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 100, customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), errors.endDate && (_jsx(Text, { className: "text-danger", children: errors.endDate.message }))] })] }), _jsxs(VStack, { children: [_jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Sujet", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { color: "#e6ebfe", width: "300px", height: "40px", ...register("subject") }), errors.subject && (_jsx(Text, { className: "text-danger", children: errors.subject.message }))] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Motif", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Textarea, { color: "#e6ebfe", height: "300px", width: "350px", resize: "none", placeholder: "Decrivez brievement le motif de votre demande...", _placeholder: { opacity: 1, color: "gray.500" }, ...register("notes") }), errors.notes && (_jsx(Text, { className: "text-danger", children: errors.notes.message }))] })] })] }) }) }), _jsx(ModalFooter, { bg: "#08162b", children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Text, { fontWeight: "500", fontSize: "1.1rem", position: "relative", top: "10px", right: "20px", color: "red.300", children: errorMessage }), _jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsxs(Text, { position: "relative", top: "8px", fontSize: "1rem", children: [" ", "Soumettre"] })] }) }), _jsx(Button, { borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: handleFormClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Annuler" })] }) })] }) })] }) })] }) })] }));
};
export default EmployeeLeavePage;
