import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, FormControl, FormLabel, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, VStack, } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import DatePicker from "react-datepicker";
import { FaSave } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdFactory, MdPerson2, MdWork } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";
import { FaRegNoteSticky } from "react-icons/fa6";
const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
    startDate: z.string().min(1, { message: errorMessage }),
    endDate: z.string().min(1, { message: errorMessage }),
    subject: z.string().min(1, { message: errorMessage }),
    notes: z.string().min(1, { message: errorMessage }),
});
const LeaveSubmissionModal = ({ isOpen, onClose, onRefresh, employees, }) => {
    const [employee, setEmployee] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
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
    //Handle leave submission
    const onSubmit = async (leaveData) => {
        setIsSubmitting(true);
        if (!employee?._id) {
            console.error("No employee selected");
            return;
        }
        try {
            const leave = await window.electron.leave.create({
                employeeId: employee._id,
                ...leaveData,
            });
            console.log("Leave successfully saved:", leave);
            setEmployee(null);
            setErrorMessage("");
            onRefresh();
            reset();
            onClose();
        }
        catch (error) {
            console.error("Unable to save leave:", error.message);
            console.error("Unable to save leave:error status", error.status);
            if (error.status == "400")
                setErrorMessage("Une demande de congé existe deja pour cet employé");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs(Modal, { size: "5xl", isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "0.5rem" }), _jsx(ModalContent, { bg: "#08162b", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(ModalHeader, { color: "#08162b", position: "relative", left: "120px", children: _jsxs(HStack, { children: [_jsx(Box, { position: "relative", left: "120px", children: _jsx("p", { style: {
                                                color: "#ffffff",
                                                fontSize: "21px",
                                                fontWeight: "600",
                                            }, children: "Demande de cong\u00E9" }) }), _jsx(Box, { position: "relative", left: "150px", children: _jsxs(Menu, { children: [_jsx(MenuButton, { backgroundColor: "transparent", as: Button, _hover: { bg: "transparent" }, children: employee?._id ? (_jsxs(HStack, { spacing: 2, children: [_jsxs(Text, { color: "#ffffff", fontSize: "22px", position: "relative", children: [employee?.firstName, " ", employee?.lastName] }), _jsxs(Text, { color: "#ffffff", fontSize: "18px", position: "relative", children: ["#", employee.matricule] })] })) : (_jsx("p", { style: { color: "#ffffff", fontSize: "16px" }, children: "Cliquez ici pour choisir un employ\u00E9" })) }), _jsx(MenuList, { maxH: "450px", overflowY: "auto", children: employees.map((employee) => (_jsx(MenuItem, { onClick: () => handleMenuClick(employee), color: "black", _hover: {
                                                            backgroundColor: "#08162b",
                                                            color: "#ffffff",
                                                        }, children: _jsxs(Text, { children: [employee.firstName, " ", employee.lastName] }) }, employee._id))) })] }) })] }) }), _jsx(ModalCloseButton, { onClick: handleFormClose }), _jsx(ModalBody, { children: _jsx(FormControl, { children: _jsxs(VStack, { spacing: "10px", children: [_jsxs(HStack, { children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: "Nom" })] }), _jsx(Input, { type: "text", color: "#e6ebfe", fontSize: "1.1rem", width: "250px", value: employee?.lastName || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: [" ", "Prenom"] })] }), _jsx(Input, { type: "text", color: "#e6ebfe", fontSize: "1.1rem", width: "250px", value: employee?.firstName || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdWork, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: [" ", "Poste"] })] }), _jsx(Input, { type: "text", color: "#e6ebfe", fontSize: "1.1rem", width: "250px", value: employee?.role || "", isReadOnly: true })] })] }), _jsxs(HStack, { children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdFactory, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: [" ", "Departement"] })] }), _jsx(Input, { color: "#e6ebfe", fontSize: "1.1rem", type: "text", width: "250px", value: employee?.department || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(FaCalendarDays, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: [" ", "Date de d\u00E9but de cong\u00E9"] })] }), _jsx(Controller, { control: control, name: "startDate", render: ({ field }) => (_jsx(DatePicker, { selected: field.value ? new Date(field.value) : null, onChange: (date) => {
                                                                    if (!date) {
                                                                        field.onChange("");
                                                                        return;
                                                                    }
                                                                    const year = date.getFullYear();
                                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                    const day = String(date.getDate()).padStart(2, "0");
                                                                    field.onChange(`${year}-${month}-${day}`);
                                                                }, locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 100, customInput: _jsx(Input, { color: "#e6ebfe", fontSize: "1.1rem", width: "300px", borderWidth: "1px" }) })) }), errors.startDate && (_jsx(Text, { className: "text-danger", children: errors.startDate.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(FaCalendarDays, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: [" ", "Date de fin de cong\u00E9"] })] }), _jsx(Controller, { control: control, name: "endDate", render: ({ field }) => (_jsx(DatePicker, { selected: field.value ? new Date(field.value) : null, onChange: (date) => {
                                                                    if (!date) {
                                                                        field.onChange("");
                                                                        return;
                                                                    }
                                                                    const year = date.getFullYear();
                                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                    const day = String(date.getDate()).padStart(2, "0");
                                                                    field.onChange(`${year}-${month}-${day}`);
                                                                }, locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 100, customInput: _jsx(Input, { color: "#e6ebfe", fontSize: "1.1rem", width: "300px", borderWidth: "1px" }) })) }), errors.endDate && (_jsx(Text, { className: "text-danger", children: errors.endDate.message }))] })] }), _jsxs(VStack, { children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(FaRegNoteSticky, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: [" ", "Sujet"] })] }), _jsx(Input, { height: "40px", color: "#e6ebfe", fontSize: "1.1rem", width: "300px", borderWidth: "1px", ...register("subject") }), errors.subject && (_jsx(Text, { className: "text-danger", children: errors.subject.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(FaRegNoteSticky, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#e6ebfe", marginBottom: "10px", fontSize: "1.1rem", children: [" ", "Motif"] })] }), _jsx(Textarea, { color: "gray.200", fontSize: "1.1rem", height: "300px", width: "350px", resize: "none", placeholder: "Decrivez brievement le motif de votre demande...", _placeholder: { opacity: 1, color: "gray.500" }, ...register("notes") }), errors.notes && (_jsx(Text, { className: "text-danger", children: errors.notes.message }))] })] })] }) }) }), _jsx(ModalFooter, { bg: "#08162b", children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Text, { fontWeight: "500", fontSize: "1.1rem", position: "relative", top: "10px", right: "20px", color: "red.300", children: errorMessage }), _jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", isLoading: isSubmitting, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: isSubmitting, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsxs(Text, { position: "relative", top: "8px", fontSize: "1rem", children: [" ", "Soumettre"] })] }) }), _jsx(Button, { borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: handleFormClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Annuler" })] }) })] }) })] }) })] }));
};
export default LeaveSubmissionModal;
