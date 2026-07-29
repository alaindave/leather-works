import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Text, VStack, HStack, Editable, EditableInput, EditablePreview, Tooltip, Box, useDisclosure, Badge, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
export const formatLateMinutes = (lateMinutes) => {
    if (lateMinutes < 60) {
        return `${lateMinutes} min`;
    }
    const hours = Math.floor(lateMinutes / 60);
    const minutes = lateMinutes % 60;
    if (minutes === 0) {
        return `${hours} h`;
    }
    return `${hours} h ${minutes} min`;
};
const formatTime = (input) => {
    if (!input)
        return null;
    const raw = String(input).trim();
    // =========================
    // 1. ISO STRING SUPPORT
    // =========================
    const iso = new Date(raw);
    if (!Number.isNaN(iso.getTime()) && raw.includes("T")) {
        return `${String(iso.getHours()).padStart(2, "0")}:${String(iso.getMinutes()).padStart(2, "0")}`;
    }
    const cleaned = raw.replace(/[hH]/g, ":");
    // =========================
    // 2. HHMM (e.g. 1830)
    // =========================
    if (/^\d{4}$/.test(cleaned)) {
        const hours = Number(cleaned.slice(0, 2));
        const minutes = Number(cleaned.slice(2, 4));
        if (Number.isNaN(hours) ||
            Number.isNaN(minutes) ||
            hours > 23 ||
            minutes > 59) {
            return null;
        }
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
    // =========================
    // 3. HMM (e.g. 930 → 09:30)
    // =========================
    if (/^\d{3}$/.test(cleaned)) {
        const hours = Number(cleaned.slice(0, 1));
        const minutes = Number(cleaned.slice(1, 3));
        if (Number.isNaN(hours) ||
            Number.isNaN(minutes) ||
            hours > 23 ||
            minutes > 59) {
            return null;
        }
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
    // =========================
    // 4. HH:MM or H:MM
    // =========================
    const match = cleaned.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match)
        return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours > 23 ||
        minutes > 59) {
        return null;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
const ClockIn = ({ attendance, onRefresh, isUnlocked, awayStatus }) => {
    if (!attendance)
        return;
    const [clockInValue, setClockInValue] = useState(formatTime(attendance?.clockIn));
    const [draftClockIn, setDraftClockIn] = useState(formatTime(clockInValue));
    const [errorMessage, setErrorMessage] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    useEffect(() => {
        if (!errorMessage)
            return;
        const timeout = setTimeout(() => {
            setErrorMessage("");
            setDraftClockIn(formatTime(clockInValue));
        }, 2000);
        return () => clearTimeout(timeout);
    }, [errorMessage]);
    const handleEditClockIn = async () => {
        const formattedClockIn = formatTime(draftClockIn);
        if (!formattedClockIn) {
            setErrorMessage("Heure invalide");
            return false;
        }
        setDraftClockIn(formattedClockIn);
        setClockInValue(formattedClockIn);
        const [hours, minutes] = formattedClockIn.split(":").map(Number);
        const clockInDate = new Date(attendance.date);
        clockInDate.setHours(hours, minutes, 0, 0);
        console.log("New time to update: ", clockInDate);
        try {
            const updatedAttendance = await window.electron.attendance.update(attendance._id, {
                clockIn: clockInDate.toISOString(),
            });
            console.log("Clock in updated successfully:", updatedAttendance);
            onRefresh?.();
            return;
        }
        catch (error) {
            console.error("Error editing clock in:", error);
            return;
        }
    };
    return (_jsx(_Fragment, { children: awayStatus ? (_jsx(Badge, { mr: "0.3rem", mb: "1rem", bg: awayStatus === "CONGÉ" ? "#3182CE" : "#E53E3E", color: "gray.200", fontSize: "14px", children: awayStatus })) : (_jsx(Box, { children: (attendance?.lateMinutes ?? 0) > 0 ? (_jsxs(Popover, { isOpen: isOpen, onClose: onClose, placement: "left", children: [_jsx(PopoverTrigger, { children: _jsx(Text, { fontSize: "18px", color: "#FF8787", cursor: "pointer", _hover: {
                                color: "#F2B705",
                            }, onMouseEnter: onOpen, onMouseLeave: onClose, children: _jsx(Tooltip, { label: errorMessage, bg: "red.600", color: "white", hasArrow: true, placement: "top", isOpen: !!errorMessage, children: _jsxs(Editable, { position: "relative", bottom: "0.1rem", value: draftClockIn, onChange: setDraftClockIn, submitOnBlur: false, width: "80px", selectAllOnFocus: true, onSubmit: handleEditClockIn, isDisabled: isUnlocked ? false : true, children: [_jsx(EditablePreview, { color: "red.600", fontSize: "18px", fontWeight: "500", px: 2, borderRadius: "6px", transition: "0.2s", cursor: isUnlocked ? "pointer" : "default", _hover: {
                                                bg: "rgba(255,255,255,0.05)",
                                                cursor: isUnlocked ? "pointer" : "default",
                                            } }), _jsx(EditableInput, { color: "brown", fontSize: "18px", width: "80px", onFocus: () => {
                                                setErrorMessage("");
                                                setDraftClockIn(formatTime(clockInValue));
                                            }, onBlur: () => {
                                                if (!formatTime(draftClockIn)) {
                                                    setErrorMessage("");
                                                    setDraftClockIn(formatTime(clockInValue));
                                                }
                                            } })] }) }) }) }), _jsxs(PopoverContent, { onMouseEnter: onOpen, onMouseLeave: onClose, bg: "#F8F9FB", borderColor: "#22345F", color: "white", position: "relative", right: "1rem", children: [_jsx(PopoverArrow, { bg: "#08162b" }), _jsx(PopoverBody, { children: _jsxs(VStack, { children: [_jsxs(HStack, { children: [attendance?.lateMinutes && (_jsx(Text, { color: "red.700", children: formatLateMinutes(attendance?.lateMinutes) })), _jsx(Text, { color: "gray.800", children: "de retard" })] }), attendance?.lateNotes && (_jsxs(Text, { position: "relative", bottom: "1rem", color: "gray.700", children: [_jsx("strong", { children: "Justification:" }), " ", attendance?.lateNotes] }))] }) })] })] })) : (_jsxs(Editable, { position: "relative", bottom: "0.5rem", value: draftClockIn, onChange: setDraftClockIn, submitOnBlur: false, width: "80px", selectAllOnFocus: true, onSubmit: handleEditClockIn, isDisabled: isUnlocked ? false : true, children: [_jsx(Tooltip, { label: errorMessage, bg: "red.600", color: "white", hasArrow: true, placement: "top", isOpen: !!errorMessage, children: _jsx(EditablePreview, { color: "green.700", fontSize: "18px", fontWeight: "500", px: 2, borderRadius: "6px", transition: "0.2s", cursor: isUnlocked ? "pointer" : "default", _hover: {
                                bg: "rgba(255,255,255,0.05)",
                                cursor: isUnlocked ? "pointer" : "default",
                            } }) }), _jsx(EditableInput, { color: "brown", fontSize: "1.1rem", width: "80px", onFocus: () => {
                            setErrorMessage("");
                            setDraftClockIn(formatTime(clockInValue));
                        }, onBlur: () => {
                            if (!formatTime(draftClockIn)) {
                                setErrorMessage("");
                                setDraftClockIn(formatTime(clockInValue));
                            }
                        } })] })) })) }));
};
export default ClockIn;
