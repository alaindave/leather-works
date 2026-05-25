import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack, useDisclosure, } from "@chakra-ui/react";
import { fr } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("fr", fr);
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { FaEdit, FaSave, FaUserEdit } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { GiRotaryPhone } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { GiRelationshipBounds } from "react-icons/gi";
import { MdFactory, MdOutlineNumbers, MdPerson2, MdWork } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateBirth: z.coerce.date().nullable().optional(),
    employeeID: z.string().min(1),
    role: z.string().optional(),
    department: z.string().optional(),
    dateHired: z.coerce.date().nullable().optional(),
    telephone: z.string().optional(),
    address: z.string().optional(),
    salary: z.string().optional(),
    emergencyContact: z.string().optional(),
    relationship: z.string().optional(),
    contactPhone: z.string().optional(),
});
const UpdateEmployee = ({ _id, employee }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ServerErrorMessage, setServerErrorMessage] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const { firstName, lastName, employeeID, dateBirth, role, department, dateHired, salary, address, telephone, emergencyContact, relationship, contactPhone, } = employee;
    const { register, handleSubmit, control, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName,
            lastName,
            employeeID,
            dateBirth,
            role,
            department,
            dateHired,
            salary,
            address,
            telephone,
            emergencyContact,
            relationship,
            contactPhone,
        },
    });
    useEffect(() => {
        if (employee) {
            reset({
                firstName: employee.firstName,
                lastName: employee.lastName,
                employeeID: employee.employeeID,
                role: employee.role,
                department: employee.department,
                salary: employee.salary,
                telephone: employee.telephone,
                emergencyContact: employee.emergencyContact,
                relationship: employee.relationship,
                contactPhone: employee.contactPhone,
                address: employee.address,
                dateBirth: employee.dateBirth ? new Date(employee.dateBirth) : null,
                dateHired: employee.dateHired ? new Date(employee.dateHired) : null,
            });
        }
    }, [employee, reset]);
    const onSubmit = async (data) => {
        console.log("Info to update: ", data);
        await axios
            .put(`${API_URL}/employees/${_id}`, data)
            .then((response) => {
            console.log("Updated employee:", response.data);
            navigate("/employees_admin/employees_list");
        })
            .catch((error) => {
            console.error("An error occured while updating info:", error);
            setServerErrorMessage("Une erreur s'est produite.Veuillez contacter ADB Tech.");
        });
    };
    const safeDate = (value) => {
        if (!value)
            return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { bg: "#0a2142", borderColor: "black", borderRadius: "18px", borderWidth: "1px", color: "#F2B705", padding: "16px", _hover: {
                    bg: "brown",
                    color: "#e6e6e6",
                    transform: "scale(1.05)",
                }, onClick: onOpen, children: [_jsx(FaEdit, { color: "#ffffff", size: "16px" }), _jsx(Text, { position: "relative", top: "8px", left: "5px", fontSize: "1.2rem", children: "Modifier" })] }), _jsxs(Modal, { size: "5xl", isOpen: isOpen, onClose: onClose, returnFocusOnClose: false, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "30px" }), _jsx(ModalContent, { bg: "#08162b", position: "relative", top: "100px", width: "53vw", children: _jsxs("form", { onSubmit: handleSubmit((data) => {
                                console.log("VALID SUBMIT", data);
                                onSubmit(data);
                            }, (errors) => {
                                console.log("VALIDATION ERRORS", errors);
                            }), children: [_jsx(ModalHeader, { color: "#ffffff", children: _jsxs(HStack, { children: [_jsx(Flex, { height: "55px", width: "55px", padding: "5px", borderRadius: "27px", borderWidth: "0.2px", borderColor: "#F2B705", justifyContent: "center", alignItems: "center", children: _jsx(FaUserEdit, { color: "#F2B705", size: "2.3rem" }) }), _jsxs(VStack, { position: "relative", top: "0.7rem", right: "3rem", children: [_jsxs(Text, { position: "relative", top: "0.5rem", fontSize: "1.7rem", children: [" ", "Modification"] }), _jsx(Text, { color: "#C7D2FE", fontSize: "15px", position: "relative", left: "4rem", bottom: "20px", children: "Modifiez les informations de l'employ\u00E9" })] })] }) }), _jsx(ModalCloseButton, {}), _jsxs(ModalBody, { marginLeft: 4, children: [_jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Nom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("lastName") }), errors.lastName && (_jsx("p", { className: "text-danger", children: errors.lastName.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Prenom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("firstName") }), errors.firstName && (_jsx("p", { className: "text-danger", children: errors.firstName.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(IoCalendarNumberSharp, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date de naissance", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Controller, { control: control, name: "dateBirth", render: ({ field }) => (_jsx(DatePicker, { selected: safeDate(field.value), onChange: (date) => field.onChange(date), locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 80, minDate: new Date(1926, 0, 1), maxDate: new Date(), customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), errors.dateBirth && (_jsx("p", { className: "text-danger", children: errors.dateBirth.message }))] })] }), _jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdOutlineNumbers, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Matricule", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("employeeID") }), errors.employeeID && (_jsx("p", { className: "text-danger", children: errors.employeeID.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdWork, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Poste", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("role") }), errors.role && (_jsx("p", { className: "text-danger", children: errors.role.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdFactory, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Departement", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsxs(Select, { width: "300px", bg: "#08162b", color: "#e6ebfe", borderColor: "#ffffff", focusBorderColor: "#F2B705", iconColor: "#F2B705", _hover: {
                                                                borderColor: "#F2B705",
                                                            }, placeholder: "Choisissez un departement", ...register("department"), children: [_jsx("option", { value: "Administration", style: { color: "black" }, children: "Administration" }), _jsx("option", { value: "Atelier", style: { color: "black" }, children: "Atelier" }), _jsx("option", { value: "Usine", style: { color: "black" }, children: "Usine" }), _jsx("option", { value: "Magasin", style: { color: "black" }, children: "Magasin" }), _jsx("option", { value: "Sentinelle", style: { color: "black" }, children: "Sentinelle" })] }), errors.department && (_jsx("p", { className: "text-danger", children: errors.department.message }))] })] }), _jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(LuCircleDollarSign, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Salaire", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { type: "number", color: "gray.300", ...register("salary") }), errors.salary && (_jsx("p", { className: "text-danger", children: errors.salary.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(GiRotaryPhone, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Telephone", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("telephone") }), errors.telephone && (_jsx("p", { className: "text-danger", children: errors.telephone.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(FaCalendarDays, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Date d'engagement", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Controller, { control: control, name: "dateHired", render: ({ field }) => (_jsx(DatePicker, { selected: safeDate(field.value), onChange: (date) => field.onChange(date), locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 80, minDate: new Date(2003, 0, 1), maxDate: new Date(), customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), errors.dateHired && (_jsx("p", { className: "text-danger", children: errors.dateHired.message }))] })] }), _jsxs(HStack, { spacing: "12px", marginBottom: "10px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Nom du contact d'urgence", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", type: "text", ...register("emergencyContact") }), errors.emergencyContact && (_jsx("p", { className: "text-danger", children: errors.emergencyContact.message }))] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(GiRelationshipBounds, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Relation avec l'employ\u00E9", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", type: "text", ...register("relationship") }), errors.relationship && (_jsx("p", { className: "text-danger", children: errors.relationship.message }))] }), _jsxs(Box, { position: "relative", top: "10px", children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdOutlineNumbers, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Telephone du contact", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", type: "text", ...register("contactPhone") }), errors.contactPhone && (_jsx("p", { className: "text-danger", children: errors.contactPhone.message }))] })] }), _jsxs(Box, { marginTop: "10px", children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(IoHome, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Addresse", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("address") }), errors.address && (_jsx("p", { className: "text-danger", children: errors.address.message }))] })] }), _jsx(ModalFooter, { bg: "#08162b", children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Text, { position: "relative", right: "20px", fontSize: "1.1rem", fontWeight: "600", color: "red.300", children: ServerErrorMessage }), _jsx(Button, { borderColor: "black", bg: "#F2B705", borderWidth: "3px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsx(Text, { position: "relative", top: "8px", fontSize: "1rem", children: "Modifier" })] }) }), _jsx(Button, { borderColor: "#ffffff", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: onClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Fermer" })] }) })] }) })] }) })] })] }));
};
export default UpdateEmployee;
