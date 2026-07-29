import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Grid, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack, useDisclosure, } from "@chakra-ui/react";
import { fr } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { FaEdit, FaSave, FaUserEdit } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { GiRelationshipBounds, GiRotaryPhone } from "react-icons/gi";
import { IoCalendarNumberSharp, IoHome } from "react-icons/io5";
import { LuCircleDollarSign } from "react-icons/lu";
import { MdFactory, MdOutlineNumbers, MdPerson2, MdWork } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { z } from "zod";
registerLocale("fr", fr);
const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
    firstName: z.string().min(1, { message: errorMessage }),
    lastName: z.string().min(1, { message: errorMessage }),
    matricule: z.string().min(1, { message: errorMessage }),
    dateBirth: z.string().min(1, { message: errorMessage }),
    role: z.string().min(1, { message: errorMessage }),
    department: z.string().min(1, { message: errorMessage }),
    dateHired: z.string().min(1, { message: errorMessage }),
    telephone: z
        .string()
        .min(1, "Le numéro de téléphone est obligatoire")
        .regex(/^\+?[0-9]{1,15}$/, "Numéro de téléphone invalide"),
    address: z.string().min(1, { message: errorMessage }),
    emergencyContact: z.string().min(1, { message: errorMessage }),
    relationship: z.string().min(1, { message: errorMessage }),
    contactPhone: z.string().min(1, { message: errorMessage }),
    salary: z.number().min(1, { message: errorMessage }),
});
const UpdateEmployee = ({ _id, employee, onUpdated }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ServerErrorMessage, setServerErrorMessage] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    if (!employee)
        return;
    const { firstName, lastName, matricule, dateBirth, role, department, dateHired, salary, address, telephone, emergencyContact, relationship, contactPhone, } = employee;
    const { register, handleSubmit, control, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName,
            lastName,
            matricule,
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
                matricule: employee.matricule,
                role: employee.role,
                department: employee.department,
                salary: employee.salary,
                telephone: employee.telephone,
                emergencyContact: employee.emergencyContact,
                relationship: employee.relationship,
                contactPhone: employee.contactPhone,
                address: employee.address,
                dateHired: employee.dateHired,
                dateBirth: employee.dateBirth,
            });
        }
    }, [employee, reset]);
    const onSubmit = async (data) => {
        setServerErrorMessage("");
        setIsUpdating(true);
        try {
            console.log("Info to update:", data);
            if (!_id)
                return;
            const updatedEmployee = await window.electron.employees.update(_id, data);
            console.log("Updated employee:", updatedEmployee);
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
    const handleFormClosed = () => {
        setServerErrorMessage("");
        onClose();
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { bg: "#4F46E5", color: "#ffffff", padding: "16px", _hover: {
                    bg: "brown",
                    color: "#e6e6e6",
                    transform: "scale(1.05)",
                }, onClick: onOpen, mr: "1rem", children: [_jsx(FaEdit, { color: "#ffffff", size: "1.2rem" }), _jsx(Text, { position: "relative", top: "8px", left: "5px", fontSize: "1.2rem", children: "Modifier" })] }), _jsxs(Modal, { size: "5xl", isOpen: isOpen, onClose: onClose, returnFocusOnClose: false, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "0.5rem" }), _jsx(ModalContent, { bg: "#08162b", position: "relative", top: "1rem", width: "53vw", children: _jsxs("form", { onSubmit: handleSubmit((data) => {
                                console.log("VALID SUBMIT", data);
                                onSubmit(data);
                            }, (errors) => {
                                console.log("VALIDATION ERRORS", errors);
                            }), children: [_jsx(ModalHeader, { color: "#ffffff", children: _jsxs(HStack, { children: [_jsx(Flex, { height: "55px", width: "55px", padding: "5px", borderRadius: "27px", borderWidth: "0.2px", borderColor: "#F2B705", justifyContent: "center", alignItems: "center", children: _jsx(FaUserEdit, { color: "#F2B705", size: "2.3rem" }) }), _jsxs(VStack, { position: "relative", top: "0.7rem", right: "3rem", children: [_jsxs(Text, { position: "relative", top: "0.5rem", fontSize: "1.7rem", children: [" ", "Modification"] }), _jsx(Text, { color: "#C7D2FE", fontSize: "15px", position: "relative", left: "4rem", bottom: "20px", children: "Modifiez les informations de l'employ\u00E9" })] })] }) }), _jsx(ModalCloseButton, {}), _jsxs(ModalBody, { marginLeft: 4, children: [_jsxs(HStack, { spacing: "0.8rem", marginBottom: "0.7rem", alignItems: "flex-start", children: [_jsxs(FormControl, { isInvalid: !!errors.lastName, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Nom" })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("lastName") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.lastName?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.firstName, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Prenom" })] }), _jsx(Input, { type: "text", color: "gray.300", borderColor: errors.firstName ? "red.400" : undefined, ...register("firstName") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.firstName?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.dateBirth, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(IoCalendarNumberSharp, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Date de naissance" })] }), _jsx(Controller, { control: control, name: "dateBirth", render: ({ field }) => (_jsx(DatePicker, { selected: field.value ? new Date(field.value) : null, onChange: (date) => {
                                                                    field.onChange(date ? date.toISOString().split("T")[0] : "");
                                                                }, locale: "fr", dateFormat: "dd/MM/yyyy", isClearable: true, showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 80, minDate: new Date(1940, 0, 1), maxDate: new Date(), customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.dateBirth?.message }) })] })] }), _jsxs(HStack, { spacing: "0.8rem", marginBottom: "0.7rem", alignItems: "flex-start", children: [_jsxs(FormControl, { isInvalid: !!errors.matricule, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdOutlineNumbers, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Matricule" })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("matricule") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.matricule?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.role, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdWork, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Poste" })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("role") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.role?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.department, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdFactory, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Departement" })] }), _jsxs(Select, { width: "300px", bg: "#08162b", color: "#e6ebfe", borderColor: "#ffffff", focusBorderColor: "#F2B705", iconColor: "#F2B705", _hover: {
                                                                borderColor: "#F2B705",
                                                            }, placeholder: "Choisissez un departement", ...register("department"), children: [_jsx("option", { value: "Administration", style: { color: "black" }, children: "Administration" }), _jsx("option", { value: "Atelier", style: { color: "black" }, children: "Atelier" }), _jsx("option", { value: "Usine", style: { color: "black" }, children: "Usine" }), _jsx("option", { value: "Magasin", style: { color: "black" }, children: "Magasin" }), _jsx("option", { value: "Sentinelle", style: { color: "black" }, children: "Sentinelle" })] }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.department?.message }) })] })] }), _jsxs(HStack, { spacing: "0.8rem", marginBottom: "0.7rem", alignItems: "flex-start", children: [_jsxs(FormControl, { isInvalid: !!errors.salary, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(LuCircleDollarSign, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Salaire" })] }), _jsx(Input, { type: "number", color: "gray.300", ...register("salary", { valueAsNumber: true }) }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.salary?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.telephone, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(GiRotaryPhone, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Telephone" })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("telephone") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.telephone?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.dateHired, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(FaCalendarDays, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Date d'embauche" })] }), _jsx(Controller, { control: control, name: "dateHired", render: ({ field }) => (_jsx(DatePicker, { selected: field.value ? new Date(field.value) : null, onChange: (date) => {
                                                                    field.onChange(date ? date.toISOString().split("T")[0] : "");
                                                                }, locale: "fr", dateFormat: "dd/MM/yyyy", isClearable: true, showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 80, minDate: new Date(1990, 0, 1), maxDate: new Date(), customInput: _jsx(Input, { color: "#e6ebfe", width: "300px", bg: "#08162b", borderColor: "#ffffff", borderWidth: "1px" }) })) }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.dateHired?.message }) })] })] }), _jsxs(Grid, { templateColumns: "repeat(3, 1fr)", gap: 4, children: [" ", _jsxs(FormControl, { isInvalid: !!errors.emergencyContact, children: [_jsxs(HStack, { children: [" ", _jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", alignItems: "center", children: [" ", "Contact d'urgence"] })] }), _jsx(Input, { color: "#e6ebfe", type: "text", h: "40px", ...register("emergencyContact") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.emergencyContact?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.relationship, children: [_jsxs(HStack, { children: [" ", _jsx(Box, { marginBottom: "10px", children: _jsx(GiRelationshipBounds, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", alignItems: "center", children: [" ", "Relation avec l'employ\u00E9"] })] }), _jsx(Input, { color: "#e6ebfe", type: "text", h: "40px", ...register("relationship") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.relationship?.message }) })] }), _jsxs(FormControl, { isInvalid: !!errors.contactPhone, children: [_jsxs(HStack, { children: [" ", _jsx(Box, { marginBottom: "10px", children: _jsx(MdOutlineNumbers, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", alignItems: "center", children: [" ", "Telephone du contact"] })] }), _jsx(Input, { color: "#e6ebfe", type: "text", h: "40px", ...register("contactPhone") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.contactPhone?.message }) })] })] }), _jsxs(FormControl, { isInvalid: !!errors.address, children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(IoHome, { color: "#F2B705", size: "1.3rem" }) }), _jsx(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: "Addresse" })] }), _jsx(Input, { type: "text", color: "gray.300", ...register("address") }), _jsx(Box, { minH: "24px", children: _jsx(FormErrorMessage, { children: errors.address?.message }) }), " "] })] }), _jsx(ModalFooter, { bg: "#08162b", children: _jsxs(VStack, { position: "relative", right: "2rem", children: [_jsx(Text, { position: "relative", right: "20px", fontSize: "1.1rem", fontWeight: "600", color: "red.300", children: ServerErrorMessage }), _jsxs(Box, { children: [_jsx(Button, { borderColor: "black", bg: "#F2B705", borderWidth: "3px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", isLoading: isUpdating, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: isUpdating, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsx(Text, { position: "relative", top: "8px", fontSize: "1rem", children: "Modifier" })] }) }), _jsx(Button, { borderColor: "#ffffff", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: handleFormClosed, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Fermer" })] }) })] })] }) })] }) })] })] }));
};
export default UpdateEmployee;
