import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Checkbox, Flex, Stack, Text, Badge, useToast, } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddPayrollEmployeeProfileModal from "../../components/AddPayrollEmployeeProfileModal";
import { FaDeleteLeft } from "react-icons/fa6";
export default function PayrollEmployeeProfileList({ type, employeeID, }) {
    const toast = useToast();
    const [profiles, setProfiles] = useState([]);
    const [originalProfiles, setOriginalProfiles] = useState([]);
    useEffect(() => {
        loadProfiles();
    }, [type]);
    const loadProfiles = async () => {
        try {
            const data = await window.electron.payrollEmployeeProfiles.getAll(employeeID, type);
            console.log("FETCHED PAYROLL PROFILES", data);
            setProfiles(structuredClone(data));
            setOriginalProfiles(structuredClone(data));
        }
        catch (error) {
            console.error(error);
        }
    };
    const toggleComponent = (_id) => {
        setProfiles((prev) => prev.map((item) => item._id === _id
            ? {
                ...item,
                enabled: item.enabled === 1 ? 0 : 1,
            }
            : item));
    };
    const save = async () => {
        try {
            const modifiedProfiles = profiles.filter((profile) => {
                const original = originalProfiles.find((o) => o._id === profile._id);
                if (!original)
                    return true;
                return (original.displayName !== profile.displayName ||
                    original.enabled !== profile.enabled ||
                    original.calculationType !== profile.calculationType ||
                    original.value !== profile.value);
            });
            if (modifiedProfiles.length === 0) {
                toast({
                    title: "Aucune modification.",
                    status: "info",
                });
                return;
            }
            await window.electron.payrollEmployeeProfiles.update(modifiedProfiles);
            toast({
                title: "Paramètres sauvegardés.",
                status: "success",
            });
            loadProfiles();
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
            await window.electron.payrollEmployeeProfiles.delete(_id);
            await loadProfiles();
        }
        catch (error) {
            console.error("AN ERROR OCCURED WHILE DELETING COMPONENT:", error);
        }
    };
    const reset = async () => {
        try {
            await window.electron.payrollEmployeeProfiles.resetToDefaults(employeeID);
            await loadProfiles();
        }
        catch (error) {
            console.error("AN ERROR OCCURED WHILE RESETTING COMPONENTS:", error);
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Flex, { justify: "space-between", mb: 3, children: [_jsx(Text, { fontWeight: "bold", fontSize: "xl", children: type === "EARNING" ? "Rémunérations" : "Déductions" }), _jsxs(Flex, { gap: 3, children: [_jsx(AddPayrollEmployeeProfileModal, { employeeID: employeeID, type: type, onCreated: loadProfiles }), _jsx(Button, { colorScheme: "yellow", onClick: save, children: "Enregistrer" }), _jsx(Button, { colorScheme: "green", onClick: reset, children: "Reinitialiser" })] })] }), _jsx(Stack, { spacing: 1, height: "65vh", overflowY: "auto", children: profiles.map((item) => (_jsxs(Flex, { position: "relative", justify: "space-between", p: 2, borderWidth: "1px", borderRadius: "lg", children: [_jsxs(Box, { children: [_jsx(Checkbox, { isChecked: item.enabled === 1 ? true : false, onChange: () => toggleComponent(item._id) }), _jsxs(Box, { ml: "3rem", mb: "2rem", children: [_jsx(Input, { value: item.displayName, fontWeight: "bold", variant: "flushed", onChange: (e) => setProfiles((prev) => prev.map((profile) => profile._id === item._id
                                                ? {
                                                    ...profile,
                                                    displayName: e.target.value,
                                                }
                                                : profile)) }), _jsxs(Select, { size: "sm", mt: 2, value: item.calculationType, onChange: (e) => setProfiles((prev) => prev.map((profile) => profile._id === item._id
                                                ? {
                                                    ...profile,
                                                    calculationType: e.target.value,
                                                    defaultValue: e.target.value === "MANUEL"
                                                        ? null
                                                        : profile.value,
                                                }
                                                : profile)), children: [_jsx("option", { value: "FIXE", children: "Montant fixe" }), _jsx("option", { value: "MANUEL", children: "Manuel" }), _jsx("option", { value: "POURCENTAGE", children: "Pourcentage" })] })] }), item.calculationType === "POURCENTAGE" ||
                                    item.calculationType === "FIXE" ? (_jsxs(Box, { children: [_jsx(Text, { fontSize: "xs", color: "gray.500", children: item.calculationType === "POURCENTAGE"
                                                ? "Pourcentage"
                                                : "Montant" }), _jsx(Input, { size: "sm", type: "number", value: item.value ?? "", onChange: (e) => setProfiles((prev) => prev.map((profile) => profile._id === item._id
                                                ? {
                                                    ...profile,
                                                    value: e.target.value === ""
                                                        ? null
                                                        : Number(e.target.value),
                                                }
                                                : profile)) })] })) : null] }), _jsxs(Box, { children: [_jsx(Box, { position: "absolute", top: "0.1rem", right: "0.4rem", onClick: () => handleDelete(item._id), children: _jsx(FaDeleteLeft, {}) }), _jsx(Badge, { mt: "3rem", colorScheme: item.enabled ? "green" : "gray", children: item.enabled ? "Activé" : "Désactivé" })] })] }, item._id))) })] }));
}
