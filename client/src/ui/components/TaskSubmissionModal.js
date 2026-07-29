import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Flex, FormLabel, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, VStack, } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdTask } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import DatePicker from "react-datepicker";
const errorMessage = "Remplissez tous les champs!";
const schema = z.object({
    subject: z.string().min(1, { message: errorMessage }),
    message: z.string().min(1, { message: errorMessage }),
    deadline: z.string().min(1, { message: errorMessage }),
});
const TaskSubmissionModal = ({ author, isOpen, onClose, onRefresh, adminUsersList, }) => {
    const [recipient, setRecipient] = useState({});
    const [taskRecipients, setTaskRecipients] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [priority, setPriority] = useState("Moyenne");
    const { register, handleSubmit, control, reset } = useForm({
        resolver: zodResolver(schema),
    });
    const handleSelectRecipients = () => {
        setErrorMessage("");
        setTaskRecipients([...taskRecipients, recipient]);
    };
    const handleRecipientDelete = (_id) => {
        const updatedRecipient = taskRecipients.filter((r) => r._id !== _id);
        setTaskRecipients(updatedRecipient);
    };
    const handleFormClose = () => {
        setRecipient({});
        setTaskRecipients([]);
        setPriority("Moyenne");
        reset();
        onClose();
        setErrorMessage("");
    };
    //Handle task creation
    const onSubmit = async (task) => {
        if (taskRecipients.length === 0) {
            console.error("No recipient selected");
            setErrorMessage("Veuillez selectionner un destinataire");
            return;
        }
        try {
            setIsSubmitting(true);
            const result = await window.electron.tasks.create({
                author: author,
                subject: task.subject,
                message: task.message,
                recipients: taskRecipients,
                deadline: task.deadline,
                priority,
            });
            console.log("Task successfully created:", result);
            setRecipient({});
            setErrorMessage("");
            onRefresh();
            reset();
            onClose();
        }
        catch (error) {
            setErrorMessage("Une erreur est survenue. Veuillez contacter ADB Tech!");
            console.error("Unable to save task:", error.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs(Modal, { size: "4xl", isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "0.5rem" }), _jsx(ModalContent, { bg: "gray.100", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit, (errors) => console.log(errors)), children: [_jsx(ModalHeader, { color: "#ffffff", children: _jsxs(Flex, { justify: "space-between", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { position: "relative", bottom: "0.5rem", color: "blue.700", fontSize: "1.6rem", children: _jsx(MdTask, {}) }), _jsx(Text, { color: "blue.700", fontFamily: "heading", fontSize: "1.6rem", children: "Nouvelle tache" })] }), _jsx(Text, { position: "relative", left: "2rem", bottom: "1.3rem", color: "gray.500", fontSize: "1rem", children: "Creer une nouvelle tache" })] }), _jsx(Box, { position: "relative", left: "3rem", children: _jsxs(Menu, { children: [_jsxs(HStack, { children: [_jsx(MenuButton, { backgroundColor: "transparent", as: Button, _hover: { bg: "transparent" }, position: "relative", top: "0.4rem", right: "5rem", onClick: () => setErrorMessage(""), children: recipient?._id ? (_jsxs(Text, { color: "blue", fontSize: "1.1rem", children: [recipient?.firstName, " ", recipient?.lastName] })) : (_jsx(Text, { color: "gray.800", position: "relative", top: "0.4rem", right: "1rem", fontSize: "1rem", children: "Choisissez les destinataires" })) }), recipient?._id && (_jsx(Button, { position: "relative", bottom: "0.7rem", right: "7.5rem", bg: "transparent", onClick: handleSelectRecipients, _hover: {
                                                                bg: "transparent",
                                                            }, children: _jsx(IoIosCheckmarkCircle, { size: "1.2rem", color: "green" }) }))] }), _jsx(MenuList, { maxH: "450px", overflowY: "auto", children: adminUsersList?.map((adminUser) => (_jsx(MenuItem, { onClick: () => setRecipient(adminUser), color: "black", _hover: {
                                                            bg: "gray.400",
                                                            color: "white",
                                                        }, children: _jsxs(Text, { color: "gray.800", children: [adminUser.firstName, " ", adminUser.lastName] }) }, adminUser._id))) })] }) })] }) }), _jsx(ModalCloseButton, { onClick: handleFormClose }), _jsxs(ModalBody, { bg: "#ffffff", height: "30rem", children: [_jsxs(HStack, { position: "relative", left: "1rem", bottom: "1.2rem", children: [_jsxs(Box, { children: [_jsx(FormLabel, { position: "relative", top: "0.5rem", children: _jsx(Text, { fontWeight: "600", fontSize: "1rem", children: "Sujet" }) }), _jsx(Input, { color: "gray.800", fontWeight: "800", fontSize: "1.2rem", width: "20rem", height: "40px", border: "1px solid #E2E8F0", placeholder: "Ex:Preparer rapport de caisse", _placeholder: {
                                                        fontSize: "1rem",
                                                        fontWeight: "500",
                                                        color: "gray.400",
                                                    }, ...register("subject") })] }), _jsxs(Box, { children: [_jsx(FormLabel, { position: "relative", top: "0.5rem", children: _jsxs(Text, { fontWeight: "600", fontSize: "1rem", children: [" ", "Date limite"] }) }), _jsx(Controller, { control: control, name: "deadline", render: ({ field }) => (_jsx(DatePicker, { selected: field.value ? new Date(field.value) : null, onChange: (date) => {
                                                            if (!date) {
                                                                field.onChange("");
                                                                return;
                                                            }
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, "0");
                                                            const day = String(date.getDate()).padStart(2, "0");
                                                            field.onChange(`${year}-${month}-${day}`);
                                                        }, locale: "fr", dateFormat: "dd/MM/yyyy", showYearDropdown: true, scrollableYearDropdown: true, yearDropdownItemNumber: 80, customInput: _jsx(Input, { position: "relative", color: "gray.600", fontWeight: "800", fontSize: "1.2rem", width: "20rem", height: "40px", border: "1px solid #E2E8F0", placeholder: "Selectionner une date", _placeholder: {
                                                                fontSize: "1rem",
                                                                fontWeight: "500",
                                                                color: "gray.700",
                                                            } }) })) })] }), _jsxs(Box, { children: [_jsx(FormLabel, { children: _jsx(Text, { position: "relative", top: "1.1rem", fontWeight: "600", fontSize: "1rem", children: "Priorite" }) }), _jsxs(Menu, { children: [_jsx(MenuButton, { children: _jsx(HStack, { children: _jsx(Text, { position: "relative", top: "0.2rem", fontWeight: "600", border: "1px solid #E2E8F0", borderRadius: "0.5rem", padding: "0.5rem", mt: "0.4rem", ml: "0.1rem", width: "150px", children: priority }) }) }), _jsxs(MenuList, { children: [_jsx(MenuItem, { onClick: () => setPriority("Haute"), children: "Haute" }), _jsx(MenuItem, { onClick: () => setPriority("Moyenne"), children: "Moyenne" }), _jsx(MenuItem, { onClick: () => setPriority("Basse"), children: "Basse" })] })] })] })] }), _jsx(FormLabel, { children: _jsx(Text, { position: "relative", top: "0.5rem", fontWeight: "600", fontSize: "1rem", children: "Description de la tache" }) }), _jsx(Textarea, { flex: "1", height: "20rem", placeholder: "Decrivez la tache en detail...", resize: "none", bg: "#ffffff", border: "1px solid #E2E8F0", color: "gray.800", fontWeight: "600", fontSize: "1.2rem", _hover: { borderColor: "yellow.300" }, _focus: {
                                        borderColor: "yellow.400",
                                        boxShadow: "0 0 0 1px #F4C20D",
                                    }, ...register("message") })] }), _jsx(ModalFooter, { bg: "gray.100", children: _jsxs(VStack, { children: [_jsx(Text, { fontWeight: "500", fontSize: "1.1rem", position: "relative", top: "10px", right: "20px", color: "red.500", children: errorMessage }), _jsxs(HStack, { height: "50px", children: [taskRecipients?.map((recipient) => (_jsxs(Box, { mr: "2rem", children: [_jsx(Button, { bg: "transparent", _hover: { bg: "transparent" }, position: "relative", left: "1.7rem", top: "1rem", onClick: () => handleRecipientDelete(recipient._id), children: _jsx(TiDelete, { size: "1.2rem" }) }), _jsx(Text, { children: recipient.firstName }), _jsx(Text, { position: "relative", bottom: "1.3rem", children: recipient.lastName })] }, `${recipient._id}-${recipient.email}`))), _jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", isLoading: isSubmitting, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: isSubmitting, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsxs(Text, { position: "relative", top: "8px", fontSize: "1rem", children: [" ", "Cr\u00E9er"] })] }) }), _jsx(Button, { borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: handleFormClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Annuler" })] }) })] })] }) })] }) })] }));
};
export default TaskSubmissionModal;
