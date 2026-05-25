import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack, useDisclosure, } from "@chakra-ui/react";
import { registerLocale } from "react-datepicker";
registerLocale("fr", fr);
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { IoPersonAdd } from "react-icons/io5";
import { GiRelationshipBounds } from "react-icons/gi";
import { BsPersonFillAdd } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { MdPerson2 } from "react-icons/md";
import { MdOutlineNumbers } from "react-icons/md";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { MdFactory } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";
import { LuCircleDollarSign } from "react-icons/lu";
import { GiRotaryPhone } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "../styles/App.css";
const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
    firstName: z.string().min(1, { message: errorMessage }),
    lastName: z.string().min(1, { message: errorMessage }),
    employeeID: z.string().min(1, { message: errorMessage }),
    dateBirth: z.date({ message: errorMessage }),
    role: z.string().min(1, { message: errorMessage }),
    department: z.string().min(1, { message: errorMessage }),
    dateHired: z.date({ message: errorMessage }),
    telephone: z.string().min(1, { message: errorMessage }),
    address: z.string().min(1, { message: errorMessage }),
    emergencyContact: z.string().min(1, { message: errorMessage }),
    relationship: z.string().min(1, { message: errorMessage }),
    contactPhone: z.string().min(1, { message: errorMessage }),
    salary: z.string().min(1, { message: errorMessage }),
});
const AddEmployee = ({ onAddEmployee }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dateBirthType, setDateBirthType] = useState("text");
    const [dateHiredType, setDateHiredType] = useState("text");
    const [ServerErrorMessage, setServerErrorMessage] = useState("");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const { register, handleSubmit, control, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = async (data) => {
        console.log("Form to be submitted:", data);
        await axios
            .post(`${API_URL}/employees`, data)
            .then((response) => {
            console.log("Employee successfully saved", response.data);
            onAddEmployee(response.data);
            onClose();
        })
            .catch((error) => {
            console.log(error);
            setServerErrorMessage("Une erreur s'est produite.Veuillez contacter ADB Tech.");
        });
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { borderColor: "black", bg: "#0a2142", borderRadius: "18px", borderWidth: "1px", color: "#F2B705", onClick: onOpen, _hover: {
                    bg: "brown",
                    color: "#e6e6e6",
                    transform: "scale(1.05)",
                }, children: [_jsx(IoPersonAdd, {}), " ", _jsx(Text, { fontSize: "15px", marginLeft: "10px", marginTop: "15px", children: "Ajouter un employ\u00E9" })] }), _jsxs(Modal, { size: "5xl", isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "10px" }), _jsx(ModalContent, { position: "relative", top: "100px", bg: "#08162b", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(ModalHeader, { color: "#ffffff", children: _jsxs(HStack, { children: [_jsx(Flex, { height: "55px", width: "55px", padding: "5px", borderRadius: "27px", borderWidth: "0.3px", borderColor: "#F2B705", justifyContent: "center", alignItems: "center", position: "relative", left: "12px", children: _jsx(BsPersonFillAdd, { color: "#F2B705", size: "2.3rem" }) }), _jsxs(VStack, { position: "relative", top: "10px", right: "18px", children: [_jsxs(Text, { position: "relative", top: "8px", fontSize: "1.7rem", children: [" ", "Nouveau employ\u00E9"] }), _jsx(Text, { color: "#C7D2FE", fontSize: "15px", position: "relative", left: "2.8rem", bottom: "20px", children: "Ajoutez les informations du nouvel employ\u00E9" })] })] }) }), _jsx(ModalCloseButton, { color: "#ffffff" }), _jsx(ModalBody, { children: _jsxs(FormControl, { children: [_jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Nom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("lastName") }), errors.lastName && (_jsx("p", { className: "text-danger", children: errors.lastName.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Prenom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("firstName") }), errors.firstName && (_jsx("p", { className: "text-danger", children: errors.firstName.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdOutlineNumbers, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Matricule", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("employeeID") }), errors.employeeID && (_jsx("p", { className: "text-danger", children: errors.employeeID.message }))] })] }), _jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(IoCalendarNumberSharp, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date de naissance", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Controller, { control: control, name: "dateBirth", render: ({ field }) => (_jsx(DatePicker, { selected: field.value, onChange: (date) => field.onChange(date), locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 100, customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdWork, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Poste", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("role") }), errors.role && (_jsx("p", { className: "text-danger", children: errors.role.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdFactory, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Departement", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsxs(Select, { width: "300px", bg: "#08162b", color: "#e6ebfe", borderColor: "#ffffff", focusBorderColor: "#F2B705", iconColor: "#F2B705", _hover: {
                                                                    borderColor: "#F2B705",
                                                                }, placeholder: "Choisissez un departement", ...register("department"), children: [_jsx("option", { value: "Administration", style: { color: "black" }, children: "Administration" }), _jsx("option", { value: "Atelier", style: { color: "black" }, children: "Atelier" }), _jsx("option", { value: "Usine", style: { color: "black" }, children: "Usine" }), _jsx("option", { value: "Magasin", style: { color: "black" }, children: "Magasin" }), _jsx("option", { value: "Sentinelle", style: { color: "black" }, children: "Sentinelle" })] }), errors.department && (_jsx("p", { className: "text-danger", children: errors.department.message }))] })] }), _jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(FaCalendarDays, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date d'engagement", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Controller, { control: control, name: "dateHired", render: ({ field }) => (_jsx(DatePicker, { selected: field.value, onChange: (date) => field.onChange(date), locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 80, minDate: new Date(2003, 0, 1), maxDate: new Date(), customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), errors.dateHired && (_jsx("p", { className: "text-danger", children: errors.dateHired.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(LuCircleDollarSign, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Salaire", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("salary") }), errors.salary && (_jsx("p", { className: "text-danger", children: errors.salary.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(GiRotaryPhone, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Telephone", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("telephone") }), errors.telephone && (_jsx("p", { className: "text-danger", children: errors.telephone.message }))] })] }), _jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Nom du contact d'urgence", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("emergencyContact") }), errors.emergencyContact && (_jsx("p", { className: "text-danger", children: errors.emergencyContact.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(GiRelationshipBounds, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Relation avec l'employ\u00E9", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("relationship") }), errors.relationship && (_jsx("p", { className: "text-danger", children: errors.relationship.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdOutlineNumbers, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Telephone du contact", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "300px", type: "text", ...register("contactPhone") }), errors.contactPhone && (_jsx("p", { className: "text-danger", children: errors.contactPhone.message }))] })] }), _jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(IoHome, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Addresse", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", marginBottom: "10px", width: "58rem", type: "text", ...register("address") }), errors.address && (_jsx("p", { className: "text-danger", children: errors.address.message }))] }) }), _jsx(ModalFooter, { bg: "#08162b", children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Text, { position: "relative", right: "20px", fontSize: "1.1rem", fontWeight: "600", color: "red.300", children: ServerErrorMessage }), _jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsxs(Text, { position: "relative", top: "8px", fontSize: "1rem", children: [" ", "Ajouter"] })] }) }), _jsx(Button, { borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: onClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Annuler" })] }) })] }) })] }) })] })] }));
};
export default AddEmployee;
