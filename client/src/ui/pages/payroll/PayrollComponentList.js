import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Checkbox, Flex, Stack, Text, Badge, useToast, } from "@chakra-ui/react";
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddPayrollComponentModal from "../../components/AddPayrollComponentModal";
import { FaDeleteLeft } from "react-icons/fa6";
export default function PayrollComponentList({ type }) {
    const toast = useToast();
    const [components, setComponents] = useState([]);
    const [originalComponents, setOriginalComponents] = useState([]);
    useEffect(() => {
        loadComponents();
    }, [type]);
    const loadComponents = async () => {
        try {
            const data = await window.electron.payrollComponents.getEnabled(type);
            setComponents(structuredClone(data));
            setOriginalComponents(structuredClone(data));
        }
        catch (error) {
            console.error(error);
        }
    };
    const toggleComponent = (_id) => {
        setComponents((prev) => prev.map((item) => item._id === _id
            ? {
                ...item,
                enabled: item.enabled === 1 ? 0 : 1,
            }
            : item));
    };
    const save = async () => {
        try {
            const modifiedComponents = components.filter((component) => {
                const original = originalComponents.find((o) => o._id === component._id);
                if (!original)
                    return true;
                return (original.displayName !== component.displayName ||
                    original.displayOrder !== component.displayOrder ||
                    original.enabled !== component.enabled ||
                    original.calculationType !== component.calculationType ||
                    original.defaultValue !== component.defaultValue);
            });
            if (modifiedComponents.length === 0) {
                toast({
                    title: "Aucune modification.",
                    status: "info",
                });
                return;
            }
            await window.electron.payrollComponents.update(modifiedComponents);
            toast({
                title: "Paramètres sauvegardés.",
                status: "success",
            });
            loadComponents();
        }
        catch (error) {
            console.error("AN ERROR OCCURED WHILE SAVING CHANGES", error);
            toast({
                title: "Erreur lors de la sauvegarde.",
                status: "error",
            });
        }
    };
    const handleDelete = async (_id) => {
        try {
            await window.electron.payrollComponents.delete(_id);
            await loadComponents();
        }
        catch (error) {
            console.error("AN ERROR OCCURED WHILE DELETING COMPONENT:", error);
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Flex, { justify: "space-between", mb: 3, children: [_jsx(Text, { fontWeight: "bold", fontSize: "xl", children: type === "EARNING" ? "Rémunérations" : "Déductions" }), _jsxs(Flex, { gap: 3, children: [_jsx(AddPayrollComponentModal, { type: type, onCreated: loadComponents }), _jsx(Button, { colorScheme: "yellow", onClick: save, children: "Enregistrer" })] })] }), _jsx(Stack, { spacing: 1, height: "65vh", overflowY: "auto", children: components.map((item) => (_jsxs(Flex, { position: "relative", justify: "space-between", p: 2, borderWidth: "1px", borderRadius: "lg", children: [_jsxs(Box, { children: [_jsx(Checkbox, { isChecked: item.enabled === 1 ? true : false, onChange: () => toggleComponent(item._id) }), _jsxs(Box, { ml: "3rem", mb: "2rem", children: [_jsxs(Flex, { align: "center", gap: 3, children: [_jsxs(Editable, { value: String(item.displayOrder), onChange: (value) => {
                                                        const displayOrder = Number(value);
                                                        if (Number.isNaN(displayOrder))
                                                            return;
                                                        setComponents((prev) => prev.map((component) => component._id === item._id
                                                            ? {
                                                                ...component,
                                                                displayOrder,
                                                            }
                                                            : component));
                                                    }, children: [_jsx(EditablePreview, { px: 2, py: 1, minW: "40px", textAlign: "center", borderRadius: "md", borderWidth: "1px", fontWeight: "bold", cursor: "pointer", _hover: { bg: "gray.100" } }), _jsx(EditableInput, { type: "number", textAlign: "center", width: "40px", px: 2 })] }), _jsx(Input, { flex: 1, value: item.displayName, fontWeight: "bold", variant: "flushed", onChange: (e) => setComponents((prev) => prev.map((component) => component._id === item._id
                                                        ? {
                                                            ...component,
                                                            displayName: e.target.value,
                                                        }
                                                        : component)) })] }), _jsxs(Select, { size: "sm", mt: 2, value: item.calculationType, onChange: (e) => setComponents((prev) => prev.map((component) => component._id === item._id
                                                ? {
                                                    ...component,
                                                    calculationType: e.target.value,
                                                    defaultValue: e.target.value === "MANUEL"
                                                        ? null
                                                        : component.defaultValue,
                                                }
                                                : component)), children: [_jsx("option", { value: "FIXE", children: "Montant fixe" }), _jsx("option", { value: "MANUEL", children: "Manuel" }), _jsx("option", { value: "POURCENTAGE", children: "Pourcentage" })] })] }), item.calculationType === "POURCENTAGE" ||
                                    item.calculationType === "FIXE" ? (_jsxs(Box, { children: [_jsx(Text, { fontSize: "xs", color: "gray.500", children: item.calculationType === "POURCENTAGE"
                                                ? "Pourcentage"
                                                : "Montant" }), _jsx(Input, { size: "sm", type: "number", value: item.defaultValue ?? "", onChange: (e) => setComponents((prev) => prev.map((component) => component._id === item._id
                                                ? {
                                                    ...component,
                                                    defaultValue: e.target.value === ""
                                                        ? null
                                                        : Number(e.target.value),
                                                }
                                                : component)) })] })) : null] }), _jsxs(Box, { children: [_jsx(Box, { position: "absolute", top: "0.1rem", right: "0.4rem", onClick: () => handleDelete(item._id), children: _jsx(FaDeleteLeft, {}) }), _jsx(Badge, { mt: "3rem", colorScheme: item.enabled ? "green" : "gray", children: item.enabled ? "Activé" : "Désactivé" })] })] }, item._id))) })] }));
}
