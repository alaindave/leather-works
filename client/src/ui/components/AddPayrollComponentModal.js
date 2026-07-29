import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, NumberInput, NumberInputField, Select, Stack, useToast, useDisclosure, Text, } from "@chakra-ui/react";
import { useState } from "react";
export default function AddPayrollComponentModal({ type, onCreated }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [calculationType, setCalculationType] = useState("MANUEL");
    const [defaultValue, setDefaultValue] = useState(0);
    const [displayOrder, setDisplayOrder] = useState(0);
    const [_, setEnabled] = useState(true);
    function resetForm() {
        setDisplayName("");
        setCalculationType("FIXE");
        setDefaultValue(0);
        setEnabled(true);
    }
    async function save() {
        if (!displayName.trim()) {
            toast({
                title: "Nom obligatoire",
                status: "warning",
            });
            return;
        }
        setLoading(true);
        try {
            const component = {
                name: displayName.toUpperCase().replace(/\s+/g, "_"),
                displayName,
                type,
                calculationType,
                displayOrder,
                defaultValue,
                percentageOf: null,
            };
            await window.electron.payrollComponents.create(component);
            toast({
                title: "Composante créée",
                status: "success",
            });
            onCreated?.();
            resetForm();
            onClose();
        }
        catch (error) {
            console.error(error);
            toast({
                title: "Erreur",
                description: "Impossible de créer le composant.",
                status: "error",
            });
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs(_Fragment, { children: [_jsx(Button, { bg: "#4F46E5", color: "#ffffff", padding: "16px", _hover: {
                    bg: "#4338CA",
                    color: "#e6e6e6",
                    transform: "scale(1.05)",
                }, borderWidth: "1px", onClick: onOpen, isLoading: loading, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: loading, children: _jsx(Text, { fontSize: "1rem", marginLeft: "0.7rem", marginTop: "1rem", children: "Ajouter" }) }), _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "lg", children: [_jsx(ModalOverlay, { backdropFilter: "blur(0.8rem)" }), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: "Ajouter un composant" }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(Stack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nom" }), _jsx(Input, { value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "Ex: Prime de transport" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Type de calcul" }), _jsxs(Select, { value: calculationType, onChange: (e) => setCalculationType(e.target.value), children: [_jsx("option", { value: "FIXE", children: "Montant fixe" }), _jsx("option", { value: "POURCENTAGE", children: "Pourcentage" }), _jsx("option", { value: "MANUEL", children: "Manuel" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Valeur par d\u00E9faut" }), _jsx(NumberInput, { min: 0, value: defaultValue, onChange: (_, value) => setDefaultValue(value), children: _jsx(NumberInputField, {}) })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Ordre" }), _jsx(NumberInput, { min: 0, value: displayOrder, onChange: (_, value) => setDisplayOrder(value), children: _jsx(NumberInputField, {}) })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { mr: 3, variant: "ghost", onClick: onClose, children: "Annuler" }), _jsx(Button, { colorScheme: "yellow", onClick: save, isLoading: loading, children: "Enregistrer" })] })] })] })] }));
}
