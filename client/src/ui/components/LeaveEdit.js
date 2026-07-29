import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, VStack, } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { z } from "zod";
const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
    startDate: z.string().min(1, { message: errorMessage }),
    endDate: z.string().min(1, { message: errorMessage }),
    subject: z.string().min(1, { message: errorMessage }),
    notes: z.string().min(1, { message: errorMessage }),
});
const LeaveEdit = ({ leave, onUpdated, isOpen, onClose }) => {
    const [ServerErrorMessage, setServerErrorMessage] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    console.log("LeaveEdit received:", leave);
    if (!leave) {
        console.log("Leave is undefined");
        return null;
    }
    const { firstName, lastName, department, role, startDate, endDate, subject, notes, } = leave;
    const onSubmit = async (data) => {
        setServerErrorMessage("");
        setIsUpdating(true);
        try {
            console.log("Info to update:", data);
            const updatedLeave = await window.electron.leave.update(leave._id, data);
            console.log("Updated leave:", updatedLeave);
            onUpdated?.();
            onClose();
        }
        catch (error) {
            console.error("An error occurred while updating info:", error);
            setServerErrorMessage("Une erreur s'est produite. Veuillez contacter ADB Tech.");
        }
        finally {
            setIsUpdating(false);
        }
    };
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            startDate: startDate,
            endDate: endDate,
            subject: subject,
            notes: notes,
        },
    });
    const handleFormClose = () => {
        reset();
        onClose();
        setServerErrorMessage("");
    };
    return (_jsxs(Modal, { size: "5xl", isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "0.5rem" }), _jsx(ModalContent, { bg: "#08162b", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(ModalHeader, { color: "#ffffff", position: "relative", left: "120px", children: _jsx(Text, { position: "relative", left: "120px", color: "#ffffff", fontWeight: "600", fontSize: "21px", children: "Modification de la demande de cong\u00E9" }) }), _jsx(ModalCloseButton, { onClick: handleFormClose }), _jsx(ModalBody, { bg: "#08162b", children: _jsx(FormControl, { children: _jsxs(VStack, { spacing: "10px", children: [_jsxs(HStack, { children: [_jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Nom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: lastName || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Prenom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: firstName || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Poste", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: role || "", isReadOnly: true })] })] }), _jsxs(HStack, { alignItems: "flex-start", children: [_jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Departement", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { type: "text", color: "#e6ebfe", width: "250px", value: department || "", isReadOnly: true })] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date de d\u00E9but de cong\u00E9", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Controller, { control: control, name: "startDate", render: ({ field }) => (_jsx(DatePicker, { selected: field.value ? new Date(field.value) : null, onChange: (date) => {
                                                                    field.onChange(date ? date.toISOString().split("T")[0] : "");
                                                                }, locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 100, customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px", value: new Date(leave.startDate).toLocaleDateString("fr-FR") }) })) }), errors.startDate && (_jsx(Text, { className: "text-danger", children: errors.startDate.message }))] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date de fin de cong\u00E9", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Controller, { control: control, name: "endDate", render: ({ field }) => (_jsx(DatePicker, { selected: field.value ? new Date(field.value) : null, onChange: (date) => {
                                                                    field.onChange(date ? date.toISOString().split("T")[0] : "");
                                                                }, locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 100, customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), errors.endDate && (_jsx(Text, { className: "text-danger", children: errors.endDate.message }))] })] }), _jsxs(VStack, { children: [_jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Sujet", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Input, { color: "#e6ebfe", width: "300px", height: "40px", ...register("subject") }), errors.subject && (_jsx(Text, { className: "text-danger", children: errors.subject.message }))] }), _jsxs(Box, { children: [_jsx(HStack, { children: _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Motif", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] }) }), _jsx(Textarea, { color: "#e6ebfe", height: "300px", width: "350px", resize: "none", placeholder: "Decrivez brievement le motif de votre demande...", _placeholder: { opacity: 1, color: "gray.500" }, ...register("notes") }), errors.notes && (_jsx(Text, { className: "text-danger", children: errors.notes.message }))] })] })] }) }) }), _jsx(ModalFooter, { bg: "#08162b", children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Text, { fontWeight: "500", fontSize: "1.1rem", position: "relative", top: "10px", right: "20px", color: "red.300", children: ServerErrorMessage }), _jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", isLoading: isUpdating, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: isUpdating, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsxs(Text, { position: "relative", top: "8px", fontSize: "1rem", children: [" ", "Soumettre"] })] }) }), _jsx(Button, { borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: handleFormClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Annuler" })] }) })] }) })] }) })] }));
};
export default LeaveEdit;
